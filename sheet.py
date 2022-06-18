import pandas as pd 

class player_sheet:

    def __init__(self):
        self.info = pd.read_csv("saves/sheet_data.csv")

        self.conditon_monitor= ["Moniteur de condition:",
                               " Physique:                      Etroudissant:",
                               "____________   ____________    ____________",
                               "|   |   |  -1| |   |   |  -6|  |   |   |  -1|",
                               "|   |   |  -2| |   |   |  -7|  |   |   |  -2|",
                               "|   |   |  -3| |   |   |  -8|  |   |   |  -3|",
                               "|   |   |  -4| |   |   |  -9|  |   |   |  -4|",
                               "|   |   |  -5| |   |   |  -9|  |   |   |  -5|",
                               " -------------- --------------  --------------",]

        #Attributs
        self.physiques={}
        self.manteaux={}
        self.speciaux={}

        #Avantage et Defaut
        self.avantages=[]
        self.defauts=[]

        #Compétence
        self.competence={}

        #Armes
        self.armes={}
        self.augmentations={}
        self.veichules={}
        self.sort={}

    def tiny_sheet():
        print ("Your charachter sheet :")
