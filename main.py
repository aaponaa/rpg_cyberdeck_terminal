import os
os.system('color')
from urllib.request import urlopen as uReq

from bs4 import BeautifulSoup as soup

from runner_sheet import RunnerSheet
from cyber_terminal import CyberTerminal


url = "https://wiki.shadowrun-jdr.fr/index.php/ShadowWiki"


def clear():
    os.system('cls' if os.name == 'nt' else 'clear')


def make_tab(my_soup, titres=[]):
    titres.extend([li.text for li in my_soup])
    return titres


def make_list(selected):
    out = []
    buff = []
    for c in selected:
        if c == '\n':
            out.append(''.join(buff))
            buff = []
        else:
            buff.append(c)
    else:
        if buff:
            out.append(''.join(buff))
    return out


def make_soup(my_url):
    client = uReq(my_url)
    page_html = client.read()
    client.close()

    page_soup = soup(page_html, features="html.parser")
    return page_soup


def souped(url, page=0):
    soup = make_soup(url).find_all('td')  # faut en faire une fonction
    menu = make_tab(soup)[int(page)]
    list_menu = make_list(menu)

    return list_menu


def main(entree='Home'):
    player = RunnerSheet()
    interface = CyberTerminal(player)
    page = 0
    my_soup = make_soup(url)

    interface.run()
    # while entree != "Exit":
    #     mode = interface.inter
    #
    #     if entree == 'Home':
    #         os.system('clear')
    #         page = 0
    #         interface.inter = "Home"
    #         interface.home()
    #         player.tiny_sheet()
    #
    #
    #
    #     elif entree == "Help":
    #         print('Commands |> Wiki, Event, Notes')
    #
    #
    #
    #     elif entree == 'Wiki':
    #         interface.inter = "Wiki"
    #         os.system('clear')
    #         interface.wiki(souped(url, page))
    #
    #
    #
    #     elif entree == "Event":
    #         interface.inter = "Event"
    #         os.system('clear')
    #         interface.event()
    #
    #
    #
    #     elif entree == "Runner":
    #         interface.inter = "Runner"
    #         os.system('clear')
    #         interface.runner()
    #
    #
    #     elif entree == "Damage":
    #         player.mc_phys += 1
    #         interface.inter = "Home"
    #         os.system('clear')
    #         interface.home()
    #         player.tiny_sheet()
    #
    #
    #
    #     elif entree == "Notes":
    #         interface.inter = "Notes"
    #         clear()
    #         interface.notes()
    #
    #     elif mode == "Notes" and entree == "Delete All":
    #         csv_write("saves/notes.csv", [])
    #
    #     elif mode == "Notes" and entree == "Add":
    #
    #         aj_list = []
    #         aj = input("Note Name : ")
    #         aj_list.append(aj)
    #         aj = input("Write Note : ")
    #         aj_list.append(aj)
    #
    #         print(aj_list)
    #         interface.list_csv.append(aj_list)
    #         print(interface.list_csv)
    #         csv_write('saves/notes.csv', interface.list_csv)
    #
    #         print("Note Added !")
    #
    #
    #     elif mode == "Wiki":
    #
    #         if entree == "L":
    #             page -= 1
    #             os.system('clear')
    #             interface.wiki(souped(url, page))
    #
    #         elif entree == "R":
    #             page += 1
    #             os.system('clear')
    #             interface.wiki(souped(url, page))
    #
    #         elif entree.isnumeric() and int(entree) >= 0 and int(entree) <= len(souped(url, page)):
    #
    #             souped_url = my_soup.find_all("a", title=str(souped(url, page)[int(entree)]))
    #             print(souped(url, page)[int(entree)])
    #             print(souped_url)
    #         else:
    #             print('Wrong Entry Retry')
    #             print(' ')
    #
    #
    #     else:
    #         print('Wrong Entry Retry')
    #         print(' ')
    #
    #     entree = interface.run()

    # print("Debug : Page = "+ str(page)+" Mode = "+ interface.inter+" Entree = "+entree)#Débug Zone


if __name__ == "__main__":
    main()
