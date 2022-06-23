import json
from collections import OrderedDict
from typing import Any

from InquirerPy import inquirer
from InquirerPy.base.control import Choice
from InquirerPy.validator import EmptyInputValidator
from termcolor import colored

from function import csv_list
from runner_sheet import RunnerSheet
from terminal_display.terminal_grid import TerminalGrid


def capitalize(s: str) -> str:
    return "" if s is None else (s[0].upper() + s[1:])


class Command:

    def __init__(self, key: str, description: str = None, action: Any = None):
        self.name = key
        self.description = description
        self.action = action

    def run(self, *args):
        self.action(*args)

    def __repr__(self):
        description = "" if self.description is None else (" - " + self.description)
        return colored(self.name + description, "blue")


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
        print(colored("Available commands : ", "green"))
        for command in self.commands.values():
            print(command)

    def run_command(self, command: str, *args):
        self.commands[command].run(*args)


class CyberTerminal:

    def __init__(self, runner_sheet: RunnerSheet = None) -> None:

        self.runner_sheet = runner_sheet
        self.list_csv = csv_list("saves/notes.csv")
        self.inter = "Home"

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
                        commands=[Command("damage", "Add damage", lambda args: self.__damage()),
                                  Command("heal", "Heal damage", lambda args: self.__heal())])
        self.__add_menu("event", on_enter=self.event)
        self.__add_menu("wiki", on_enter=self.wiki)
        self.__add_menu("notes", on_enter=self.notes,
                        commands=[Command("add", "Add a note", lambda args: self.__add_note()),
                                  Command("delete", "Delete notes", lambda args: self.__delete_notes())])
        self.current_menu = None

    def __add_menu(self, name: str, commands: [Command] = None, on_enter: Any = None):
        self.menus[name] = Menu(name, commands=commands, on_enter=on_enter)

    def __select_menu(self, name: str):
        if name in self.menus:
            self.current_menu = self.menus[name]
            self.current_menu.enter()
        else:
            print(colored("Unknown command '" + name + "'"))

    def print_header(self):
        for line in self.shadow:
            print(colored(line, "green"))
        print(colored(self.sep, "red"))
        print('')
        self.print_menu()

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

    def home(self):
        self.print_header()
        if self.runner_sheet is not None:
            self.runner_sheet.display_monitor("green")

    def wiki(self, soup_list=None):
        it = 0

        self.print_header()
        # for tab in soup_list:
        #     if it == 0:
        #         print(colored('                                           L <| ' + tab + ' |> R', "green"))
        #         print(' ')
        #     else:
        #         print(str(it) + ' :' + tab)
        #
        #     it += 1
        print('TODO')

    def event(self, *args):
        events = OrderedDict()
        events["Event 1"] = "This is the first event"
        events["Event 2"] = "This is the second event"
        events["Event 3"] = "This is the third event"
        choices = []
        for (i, event) in enumerate(events):
            if i == 0:
                choices.append(Choice(value=event, name=event))
            else:
                choices.append(event)
        choices.append("Exit")
        if len(events) > 0:
            event = inquirer.select(
                mandatory=False,
                message="Select the event (Ctrl-Z to exit)",
                choices=choices,
                default=None,
            ).execute()
            if event is not None and event != "Exit":
                print(colored(events[event], "green"))

    def __damage(self):
        print(colored("Take damage (ctrl-z to cancel)", "blue"))
        type = inquirer.select(
            mandatory=False,
            message="Damage type",
            choices=[Choice(value="physical", name="Physical"), Choice(value="stun", name="Stun")],
            default=None,
        ).execute()
        if type is not None:
            val = inquirer.number(
                message="Amount",
                min_allowed=1,
                max_allowed=30 if type == "physical" else 10,
                default=None,
                validate=EmptyInputValidator()
            ).execute()

            self.runner_sheet.damage(type, int(val))
            self.home()

    def __heal(self):
        print(colored("Heal damage (ctrl-z to cancel)", "blue"))
        type = inquirer.select(
            mandatory=False,
            message="Heal type",
            choices=[Choice(value="physical", name="Physical"), Choice(value="stun", name="Stun")],
            default=None,
        ).execute()
        if type is not None:
            val = inquirer.number(
                message="Amount",
                min_allowed=1,
                max_allowed=30 if type == "physical" else 10,
                default=None,
                validate=EmptyInputValidator()
            ).execute()

            self.runner_sheet.heal(type, int(val))
            self.home()

    def notes(self, *args):
        self.print_header()
        for (i, note) in enumerate(self.__get__notes()):
            print(str(i) + " |> " + note["name"] + " : " + note["content"])

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

    def __add_note(self):
        print(colored("Add note (ctrl-z to cancel)", "blue"))

        note_name = inquirer.text(message="Name").execute()
        note_content = inquirer.text(message="Content").execute()
        notes = self.__get__notes()
        notes.append({
            "name": note_name,
            "content": note_content
        })

        self.__save_notes(notes)
        self.notes()

    def __delete_notes(self):
        print(colored("Delete notes (ctrl-z to cancel)", "blue"))
        data = self.__get__notes()
        choices = [Choice(value=i, name=note["name"] + " : " + note["content"], enabled=False)
                   for (i, note) in enumerate(data)]

        notes_to_delete = inquirer.checkbox(
            message="Select notes to delete",
            choices=choices,
            cycle=True,
            validate=lambda result: len(result) > 1,
            invalid_message="Select at least one note",
        ).execute()

        for i in reversed(sorted(notes_to_delete)):
            data = data[:i] + data[i + 1:]

        self.__save_notes(data)
        self.notes()

    @staticmethod
    def logout():
        exit()
