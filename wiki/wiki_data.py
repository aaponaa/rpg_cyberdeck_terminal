import functools
import json
import os

from utils import get_path

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

"""
"description": "Dans le Sixième Monde, l'humanité a évolué en cinq sous-espèces principales, ou métatypes : les Nains, les Elfes, les Humains, les Orks et les Trolls. Les termes de métahumanité et de métahumains désignent soit, de manière globale, l'ensemble des individus de ces sous-espèces, soit uniquement ceux des sous-espèces non humaines. La deuxième acception est plus souvent utilisée dans un contexte xénophobe.\n",
    "sections": [
        {
            "name": "Classification principale et variantes",
            "description": "",
            "sections": [
                {
"""


class WikiEntrySection:

    def __init__(self, section: dict):
        self.raw = section
        self.name = section["name"]
        self.content = "" if "content" not in section else section["content"]
        self.sections = [] if "sections" not in section else [WikiEntrySection(sub_section) for sub_section in
                                                              section["sections"]]

    def __repr__(self):
        return str(self.raw)


class WikiEntry:

    def __init__(self, json_entry: dict):
        self.raw = json_entry
        self.url = json_entry["url"]
        self.title = json_entry["title"]
        self.description = "" if "description" not in json_entry else json_entry["description"]
        self.sections = [] if "sections" not in json_entry else [WikiEntrySection(section) for section in
                                                                 json_entry["sections"]]
        self.categories = [] if "categories" not in json_entry else json_entry["categories"]

    def __repr__(self):
        return str(self.raw)


class WikiData:

    def __init__(self):
        with open(get_path("wiki", "data", "wiki.json"), "r", encoding="utf-8") as f:
            self.data = json.load(f)
            self.entries = [WikiEntry(e) for e in self.data]
            self.categories = set([category for entry in self.entries for category in entry.categories])

    def find_entry(self, title: str) -> WikiEntry:
        for entry in self.entries:
            if entry.title == title:
                return entry

    def find_entries(self, category: str = None) -> [WikiEntry]:
        result = []
        for entry in self.entries:
            if category is None or category in entry.categories:
                result.append(entry)
        result.sort(key=functools.cmp_to_key(self.__compare_titles))
        return result

    @staticmethod
    def __compare_titles(e1: WikiEntry, e2: WikiEntry) -> int:
        return 0 if e1.title == e2.title else 1 if e1.title > e2.title else -1


if __name__ == "__main__":
    wiki = WikiData()
    entry = wiki.find_entry("2060")
    print(entry.title)
    print(entry.description)
    print(entry.sections)
    print(entry.categories)

    print([e.title for e in wiki.find_entries("Année")])
