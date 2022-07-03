import json
import re
import sys
from collections import OrderedDict
from typing import Any

from InquirerPy import inquirer
from InquirerPy.base.control import Choice
from InquirerPy.validator import EmptyInputValidator
from termcolor import colored

from runner_sheet import RunnerSheet
from terminal_display.terminal_grid import TerminalGrid
from utils import capitalize
from wiki.net_spider_runner import NetSpiderRunner
from wiki.wiki_data import WikiData, WikiEntry


class Command:

    def __init__(self, key: str, description: str = None, action: Any = None):
        self.name = key
        self.description = description
        self.action = action

    def run(self, *args):
        self.action(*args)

    def __repr__(self):
        description = "" if self.description is None else (" - " + self.description)
        return colored(self.name, "cyan") + colored(description, "blue")


class Menu:
    def __init__(self, name: str, on_enter: Any = None, commands: [Command] = None):
        self.name = name
        self.on_enter = on_enter if on_enter is not None else self.__dummy
        self.commands = OrderedDict()
        if commands is not None:
            for command in commands:
                self.commands[command.name] = command

    def enter(self):
        self.on_enter()

    def __dummy(self):
        pass

    def help(self):
        print(colored("Commandes disponibles : ", "green"))
        for command in self.commands.values():
            print(command)

    def run_command(self, command: str, *args):
        self.commands[command].run(*args)


class CyberTerminal:

    def __init__(self, runner_sheet: RunnerSheet = None) -> None:

        self.runner_sheet = runner_sheet

        self.shadow = [
            "                     ____    __                   __                       ____                        ",
            "                    /\  _`\ /\ \                 /\ \                     /\  _ `\ '                   ",
            "                    \ \,\L\_\ \ \___      __     \_\ \    ___   __  __  __\ \ \L\ \  __  __    ___     ",
            "                     \/_\__ \\ \  _ `\  /'__`\   /'_` \  / __`\/\ \/\ \/\ \\ \ ,  /  /\ \/\ \ /' _ `\  ",
            "                       /\ \L\ \ \ \ \ \/\ \L\.\_/\ \L\ \/\ \L\ \ \ \_/ \_/ \\ \ \ \ \ \ \ \_\\/\ \/\ \ ",
            "                       \ `\____\ \_\ \_\ \__/.\_\ \___,_\ \____/\ \___x___/' \ \_\ \_\ \____/\ \_\ \_\ ",
            "                        \/_____/\/_/\/_/\/__/\/_/\/__,_ /\/___/  \/__//__/    \/_/\/ /\/___/  \/_/\/_/ "]

        self.sep = "                         ------------------------------------------------------------------------------"

        self.menus = OrderedDict()
        self.__add_menu("home", on_enter=self.home,
                        commands=[Command("damage", "Prendre des dégâts", lambda args: self.__damage()),
                                  Command("heal", "Soigner des dégâts", lambda args: self.__heal())])
        self.__add_menu("event", on_enter=self.event)
        self.__add_menu("wiki", on_enter=self.wiki,
                        commands=[Command("search", "Chercher des informations", lambda args: self.__wiki_search()),
                                  Command("update", "Mettre à jour la base de données",
                                          lambda args: self.__update_wiki())])
        self.__add_menu("notes", on_enter=self.notes,
                        commands=[
                            Command("list", "Voir les notes", lambda args: self.__list_notes()),
                            Command("add", "Ajouter une note", lambda args: self.__add_note()),
                            Command("delete", "Supprimer des notes", lambda args: self.__delete_notes())])
        self.current_menu = None

        self.wiki_data = WikiData()

    def __add_menu(self, name: str, commands: [Command] = None, on_enter: Any = None):
        self.menus[name] = Menu(name, commands=commands, on_enter=on_enter)

    def __select_menu(self, name: str):
        if name in self.menus:
            self.current_menu = self.menus[name]
            self.current_menu.enter()
        else:
            print(colored("Commande non reconnue '" + name + "'"))

    def print_header(self):
        for line in self.shadow:
            print(colored(line, "green"))
        print(colored(self.sep, "red"))
        self.print_menu()
        print('')

    def print_menu(self):
        menu_grid = TerminalGrid(default_color="green")
        for (i, menu) in enumerate(self.menus.values()):
            menu_label = capitalize(menu.name)
            if menu == self.current_menu:
                menu_label = colored(menu_label, "red")
            menu_grid.add(menu_label, 0, 2 * i, width=len(menu.name))
            if i < len(self.menus) - 1:
                menu_grid.add("|", 0, 2 * i + 1)
        for line in menu_grid.lines():
            print(" " * 38 + line)

    def run(self):
        self.__select_menu("home")
        while True:
            input = self.__input()
            if input is not None and len(input) > 0:
                input = input.lower()
                commands = input.split(" ")
                if commands[0] == "help":
                    self.current_menu.help()
                elif commands[0] == "exit":
                    self.logout()
                elif commands[0] in self.menus:
                    self.__select_menu(commands[0])
                else:
                    if commands[0] in self.current_menu.commands:
                        self.current_menu.run_command(commands[0], commands[1:])
                    else:
                        print(colored("Unknown command '" + commands[0] + "'", "red"))

    @staticmethod
    def __input():
        return input(colored("cyberdeck@h00ked", "green") + colored("$", "red") + colored('60.15.75.35: ', 'yellow'))

    #########################################################
    #                          HOME                         #
    #########################################################

    def home(self):
        self.print_header()
        if self.runner_sheet is not None:
            self.runner_sheet.display_monitor("green")
            print('')

    def __damage(self):
        print(colored("Subir des dégats", "blue"))
        type = inquirer.select(
            mandatory=False,
            message="Type",
            choices=[Choice(value="physical", name="Physique"), Choice(value="stun", name="Etourdissant")],
            default=None,
        ).execute()
        if type is not None:
            val = inquirer.number(
                mandatory=False,
                message="Dégâts",
                min_allowed=1,
                max_allowed=30 if type == "physical" else 10,
                default=None,
                validate=EmptyInputValidator()
            ).execute()

            self.runner_sheet.damage(type, int(val))
            self.home()

    def __heal(self):
        print(colored("Soigner des dégâts", "blue"))
        type = inquirer.select(
            mandatory=False,
            message="Type",
            choices=[Choice(value="physical", name="Physique"), Choice(value="stun", name="Etourdissant")],
            default=None,
        ).execute()
        if type is not None:
            val = inquirer.number(
                message="Soins",
                min_allowed=1,
                max_allowed=30 if type == "physical" else 10,
                default=None,
                validate=EmptyInputValidator()
            ).execute()

            self.runner_sheet.heal(type, int(val))
            self.home()

    #########################################################
    #                          WIKI                         #
    #########################################################

    def wiki(self, soup_list=None):
        it = 0
        self.print_header()

    def __wiki_search(self):

        search_type = inquirer.select(
            mandatory=False,
            message="Rechercher par",
            choices=[
                Choice(value=1, name="Titre"),
                Choice(value=0, name="Catégorie"),
            ],
            default=1,
        ).execute()

        if search_type is None:
            return

        category_choice = None
        if search_type == 0:
            category_choice = inquirer.fuzzy(
                mandatory=False,
                message="Sélectionnez une catégorie :",
                choices=sorted(self.wiki_data.categories),
                default="",
                max_height="30%",
            ).execute()

            if category_choice is None:
                return

        entries = {
            e.title: e for e in self.wiki_data.find_entries(category=category_choice)
        }

        entry_choice = inquirer.fuzzy(
            mandatory=False,
            message="Sélectionnez une entrée :",
            choices=sorted(entries.keys()),
            default="",
            max_height="30%",
        ).execute()

        if entry_choice is None:
            return

        text_color = "cyan"
        entry: WikiEntry = entries[entry_choice]
        lines = []
        title = "---- " + entry.title + " ----"
        lines.append(colored(title, "yellow"))
        lines.append("")
        if len(entry.description) > 0:
            lines.extend([colored(l, text_color) for l in entry.description.splitlines(keepends=True)])
        if len(entry.sections) > 0:
            for section in entry.sections:
                lines.append("")
                lines.append(colored("--- " + section.name, "red"))
                lines.append("")
                if len(section.content) > 0:
                    lines.extend([colored(l, text_color) for l in section.content.splitlines(keepends=True)])
                if len(section.sections) > 0:
                    for subsection in section.sections:
                        lines.append("")
                        lines.append(colored("-- " + subsection.name, "yellow"))
                        lines.append("")
                        if len(subsection.content) > 0:
                            lines.extend([colored(l, text_color) for l in subsection.content.splitlines(keepends=True)])

        stop = False
        i = 0
        max_lines = 20
        while not stop:
            to_print = lines[i:i + max_lines]
            i += max_lines
            while len(to_print[-1]) == 0 or re.match(".*--(-?) .*", to_print[-1]) is not None:
                to_print = to_print[:len(to_print) - 1]
                i -= 1

            for line in to_print:
                print(line)

            if i < len(lines):
                stop = not inquirer.confirm(message="Continuer à lire ?", default=True, mandatory=False).execute()
                if not stop:
                    sys.stdout.write('\x1b[1A')
                    sys.stdout.write('\x1b[2K')
            else:
                stop = True

    def __update_wiki(self):
        print(colored("Connexion à la base de données...", "blue"))
        NetSpiderRunner().run()
        print(colored("Connexion terminée", "blue"))
        self.wiki_data = WikiData()

    #########################################################
    #                         EVENTS                        #
    #########################################################

    def event(self, *args):
        events = self.__get_events()
        if len(events) > 0:
            event = inquirer.select(
                mandatory=False,
                message="Sélectionnez un évènement",
                choices=list(map(lambda e: Choice(value=e, name=e["name"]), events)),
                default=None,
            ).execute()

            if event is not None:
                print(colored(event["content"], "cyan"))

    def __get_events(self):
        # TODO ?
        return [{
            "name": "Event 1",
            "content": "This is the first event"
        },
            {
                "name": "Event 2",
                "content": "This is the second event"
            },
            {
                "name": "Event 3",
                "content": "This is the third event"
            }]

    #########################################################
    #                         NOTES                         #
    #########################################################

    def notes(self, *args):
        self.print_header()

    def __get__notes(self):
        with open('saves/notes.json', 'r') as f:
            data: list = json.load(f)["notes"]
            return data

    def __save_notes(self, notes: list):
        with open('saves/notes.json', 'w') as f:
            d = {
                "notes": notes
            }
            f.write(json.dumps(d, indent=4))

    def __list_notes(self):
        for (i, note) in enumerate(self.__get__notes()):
            print(str(i) + " |> " + note["name"] + " : " + note["content"])

    def __add_note(self):
        print(colored("Ajouter une note", "blue"))

        note_name = inquirer.text(message="Nom :").execute()
        note_content = inquirer.text(message="Contenu :").execute()
        notes = self.__get__notes()
        notes.append({
            "name": note_name,
            "content": note_content
        })

        self.__save_notes(notes)

    def __delete_notes(self):
        print(colored("Supprimer des notes", "blue"))
        data = self.__get__notes()
        choices = [Choice(value=i, name=note["name"] + " : " + note["content"], enabled=False)
                   for (i, note) in enumerate(data)]

        notes_to_delete = inquirer.checkbox(
            message="Choisissez les notes à supprimer",
            choices=choices,
            cycle=True,
            validate=lambda result: len(result) >= 1,
            invalid_message="Choisissez au moins une note",
        ).execute()

        if inquirer.confirm(message="Êtes-vous sûr ?", default=True).execute():
            for i in reversed(sorted(notes_to_delete)):
                data = data[:i] + data[i + 1:]

            self.__save_notes(data)

    @staticmethod
    def logout():
        exit()
