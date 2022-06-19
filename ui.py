from termcolor import colored
from function import csv_list

class Cmd_ui():

    def __init__(self) -> None:
        
        self.list_csv = csv_list("saves/notes.csv")
        self.inter = "Home"

        self.shadow = [
        "                     ____    __                   __                       ____                        ",
        "                    /\  _`\ /\ \                 /\ \                     /\  _ `\ '                   " ,
        "                    \ \,\L\_\ \ \___      __     \_\ \    ___   __  __  __\ \ \L\ \  __  __    ___     ",
        "                     \/_\__ \\ \  _ `\  /'__`\   /'_` \  / __`\/\ \/\ \/\ \\ \ ,  /  /\ \/\ \ /' _ `\  ",
        "                       /\ \L\ \ \ \ \ \/\ \L\.\_/\ \L\ \/\ \L\ \ \ \_/ \_/ \\ \ \ \ \ \ \ \_\\/\ \/\ \ ",
        "                       \ `\____\ \_\ \_\ \__/.\_\ \___,_\ \____/\ \___x___/' \ \_\ \_\ \____/\ \_\ \_\ ",
        "                        \/_____/\/_/\/_/\/__/\/_/\/__,_ /\/___/  \/__//__/    \/_/\/ /\/___/  \/_/\/_/ "]

        self.menu =[
        "                                        _____________________________________________",
        "                                       | Home | Wiki | Event | Notes | Runner | Help |",
        "                                        ---------------------------------------------",
        "",]

        self.sep="                         ------------------------------------------------------------------------------"

        pass

    def header (self):
        
        for line in self.shadow:
            print(colored(line,"green"))

        print(colored(self.sep,"red"))
        
        for line in self.menu:
            print(colored(line, "green"))

    def run(self):

        print('')
        entree = input(colored("cyberdeck@h00ked", "green")+ colored("$", "red")+ colored('60.15.75.35: ', 'yellow'))

        return entree


    def home(self):

        self.header()

    def wiki(self,soup_list):
        it = 0

        self.header()
        for tab in soup_list:
            if it == 0:
                print(colored('                                           L <| '+ tab +' |> R', "green"))
                print(' ')
            else:
                print(str(it)+' :'+tab)
                
            it += 1
        print('')

    def event(self):

        self.header()
        print('')
        print('There is no new events')
        print('')

    def notes(self):

        self.list_csv = csv_list("saves/notes.csv")
        it = 0

        self.header()


        print('')

        print('Your Notes : ') 
        print('')

        #if self.list_csv != []:
         #   for no in self.list_csv:
          #      print(str(it) +" |> "+ no[0]+ " : " +no[1])
         #       print('')
       #         it+=1
        #else:
     #       print('There is no notes')
    #
        print(self.list_csv)

    def runner(self):
        self.header()
        print("Here is your charachter sheet !")    

