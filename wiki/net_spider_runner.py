from __future__ import annotations

import os
import re
import shutil
from multiprocessing import Process

import lxml.html
import scrapy
from bs4 import BeautifulSoup
from bs4.builder._lxml import LXMLTreeBuilder
from lxml.etree import tostring
from scrapy import signals, Selector
from scrapy.crawler import CrawlerProcess
from scrapy.link import Link
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
from termcolor import colored
from tqdm import tqdm

from utils import get_path


def get_attribute(element, attribute: str) -> str:
    s = element.attrib.get(attribute)
    return "" if s is None else s


def matches(string: str, possible_matches: [str]) -> bool:
    string = "" if string is None else string
    for m in possible_matches:
        if re.match(m, string) is not None:
            return True
    return False


def clean_html(nodes: list, tags_to_clean: list = None) -> str:
    result = []
    for node in nodes:
        html = tostring(node) if isinstance(node, lxml.html.HtmlElement) else node.get()
        bs = BeautifulSoup(html, builder=LXMLTreeBuilder)

        if tags_to_clean is not None:
            for tag_to_clean in tags_to_clean:
                bs = remove_tag(bs, tag_to_clean[0], attrs=tag_to_clean[1])

        s = bs.get_text().replace(u"\xa0", " ")
        if len(s) > 0 and s != "Logo":
            result.append(s)

    return "\n".join(result).strip()


def remove_tag(bs: BeautifulSoup, tag: str, attrs: dict = None) -> BeautifulSoup:
    sup = bs.find_all(tag, attrs=attrs)
    if sup is not None:
        for s in sup:
            s.extract()
    return bs


class WikiItem(scrapy.Item):
    url = scrapy.Field()
    title = scrapy.Field()
    description = scrapy.Field()
    sections = scrapy.Field()
    categories = scrapy.Field()


class WikiSpider(CrawlSpider):
    name = "netspider"
    start_urls = ["https://wiki.shadowrun-jdr.fr/index.php/ShadowWiki"]
    rules = [
        Rule(LinkExtractor(allow_domains=("wiki.shadowrun-jdr.fr")),
             callback="parse",
             process_links="filter_links",
             follow=True)
    ]

    def __init__(self, show_progress=False, **kwargs):
        super().__init__(**kwargs)
        self.show_progress = show_progress

        self.links = set()
        self.titles = set()

        self.tags_to_clean = [
            ("sup", {"class": "reference"}),
            ("img", {}),
            ("div", {"id": "toc"}),
            ("table", {"class": "toccolours"}),
            ("table", {"class": "cartes"})
        ]

        self.excluded_titles = ["ShadowWiki", "Personnalité-Vide", "^Projet:.*", "^Catégorie.*", "^Source:.*",
                                "^Modèle:.*"]

        self.excluded_sections = ["sources", "références", "référence", "voir aussi", "sommaire", "liens externes",
                                  "notes et références", "références externes"]

        self.excluded_elements = [
            lambda e: e.tag == "table",
            lambda e: e.tag == "div" and e.attrib.get("id") == "toc",
            lambda e: e.tag == "a" and "mw-jump-link" in get_attribute(e, "class"),
            lambda e: e.tag == "div" and "thumb tright" in get_attribute(e, "class"),
            lambda e: e.tag == "div" and get_attribute(e, "id") == "stub",
            lambda e: e.tag == "p" and matches(
                clean_html([e], self.tags_to_clean), ["^Années\s?:.*", "^Décennies\s?:.*", ])
        ]

        self.stop_elements = [
            lambda e: e.tag == "h2",
            lambda e: e.tag == "h3",
            lambda e: e.tag == "div" and e.attrib.get("id") == "toc"
        ]

    def parse(self, response: scrapy.http.TextResponse, **kwargs):
        title = response.selector.xpath("//h1[@id='firstHeading']/text()").get().strip()

        if "Cat%C3%A9gorie" not in response.url \
                and response.url not in self.links \
                and title not in self.titles \
                and True not in list(map(lambda x: re.match(x, title) is not None, self.excluded_titles)):

            self.links.add(response.url)
            self.titles.add(title)

            content_wrapper = response.selector.xpath("//div[@class='mw-parser-output']")
            content = response.selector.xpath("//div[@class='mw-parser-output']/*[1]")
            if len(content_wrapper) > 0 and len(content) > 0:
                nodes = self.__find_consecutive_nodes(content[0])
                h2_sections = self.__find_section_nodes(content_wrapper[0], ".//h2")
                sections = []
                for (section_node, name) in h2_sections:
                    before_sub_sections = self.__find_consecutive_nodes(section_node)[1:]
                    h3_sections = self.__find_section_nodes(section_node, "./following-sibling::h3")
                    if len(h3_sections) > 0:
                        sub_sections = []
                        for (sub_section, sub_name) in h3_sections:
                            sub_content = self.__get_section_content(sub_section)
                            if len(sub_content) > 0:
                                sub_sections.append({
                                    "name": sub_name,
                                    "content": sub_content
                                })
                        sections.append({
                            "name": name,
                            "content": clean_html(before_sub_sections, self.tags_to_clean),
                            "sections": sub_sections
                        })
                    else:
                        section_content = self.__get_section_content(section_node)
                        if len(section_content) > 0:
                            sections.append({
                                "name": name,
                                "content": section_content
                            })

                categories = response.selector.xpath(
                    "//div[@id='catlinks']//a[contains(text(), 'Catégorie')]/following-sibling::ul/li/a/text()").getall()
                description_nodes = self.__find_consecutive_nodes(content[0])

                return WikiItem(url=response.url,
                                title=title,
                                description=clean_html(description_nodes, self.tags_to_clean),
                                sections=sections,
                                categories=categories)

    def filter_links(self, links: [Link]) -> [Link]:
        return list(filter(lambda l: WikiSpider.is_actual_link(l) and l.url not in self.links, links))

    @staticmethod
    def is_actual_link(link: Link) -> bool:
        to_exclude = [".*limit=.*", ".*action=.*", ".*Sp%C3%A9cial:.*", ".*/Discussion_.*", ".*Discussion:.*", ".*&.*"]
        return (link.fragment is None or len(link.fragment) == 0) and not matches(link.url, to_exclude)

    def __get_section_content(self, node: scrapy.selector.unified.Selector) -> str:
        siblings = node.xpath('./following-sibling::*')
        if len(siblings) > 0:
            content = clean_html(self.__find_consecutive_nodes(siblings[0]), self.tags_to_clean)
            return content
        return ""

    def __find_section_nodes(self, node: Selector, section_selector: str) -> [Selector]:
        headers = node.xpath(section_selector)
        sections = []
        for header in headers:
            if not self.__is_excluded_element(header.root):
                name = clean_html([header], self.tags_to_clean).strip()
                if name.lower() not in self.excluded_sections:
                    sections.append((header, name))
        return sections

    def __find_consecutive_nodes(self, node: Selector) -> [Selector]:
        nodes = [node]
        stop = False
        next_node = node
        while not stop:
            next_node = next_node.xpath('./following-sibling::*')
            if len(next_node) > 0:
                next_node = next_node[0]
                if not self.__is_stop_element(next_node.root):
                    nodes.append(next_node)
                else:
                    stop = True
            else:
                stop = True
        return list(filter(lambda x: not self.__is_excluded_element(x.root), nodes))

    def __is_excluded_element(self, element: lxml.html.HtmlElement) -> bool:
        return True in list(map(lambda matcher: matcher(element), self.excluded_elements))

    def __is_stop_element(self, element: lxml.html.HtmlElement) -> bool:
        return True in list(map(lambda matcher: matcher(element), self.stop_elements))

    def spider_opened(self, spider: scrapy.Spider):
        if self.show_progress:
            self.progress = tqdm(unit=" éléments", position=0)
            self.progress.set_description_str(colored("Récupération des données ", "yellow"))

    def spider_closed(self, spider: scrapy.Spider):
        if self.show_progress:
            self.progress.clear()
            self.progress.close()

    def __item_scraped(self, item: scrapy.Item) -> scrapy.Item:
        if self.show_progress:
            self.progress.update(1)
        return item

    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs) -> WikiSpider:
        spider = super(WikiSpider, cls).from_crawler(crawler, *args, **kwargs)
        crawler.signals.connect(spider.spider_opened, signals.spider_opened)
        crawler.signals.connect(spider.spider_closed, signals.spider_closed)
        crawler.signals.connect(spider.__item_scraped, signals.item_scraped)
        return spider


def crawl():
    process = CrawlerProcess({
        "LOG_LEVEL": "ERROR",

        "FEEDS":
            {"wiki.json": {"format": "json",
                           "indent": 4,
                           "item_classes": [WikiItem],
                           "overwrite": True, }
             },
        "FEED_EXPORT_ENCODING": "utf-8"
    })
    process.crawl(WikiSpider, show_progress=True)
    process.start()


class NetSpiderRunner:
    def run(self):
        p = Process(target=crawl)
        p.start()
        p.join()
        export_file = get_path("wiki", "data", "wiki.json")
        shutil.copyfile("wiki.json", export_file)
        os.remove("wiki.json")


if __name__ == "__main__":
    NetSpiderRunner().run()
