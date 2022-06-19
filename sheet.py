from termcolor import colored


class Player_sheet:

    def __init__(self):
        # self.info = pd.read_csv("saves/sheet_data.csv")

        self.mc_etour = 0
        self.mc_phys = 6
        self.p = []
        self.e = []

        for i in range(30):
            self.p.append("")

        for i in range(30):
            self.e.append("")

        # Attributs
        self.physiques = {}
        self.manteaux = {}
        self.speciaux = {}

        # Avantage et Defaut
        self.avantages = []
        self.defauts = []

        # Compétence
        self.competence = {}

        # Armes
        self.armes = {}
        self.augmentations = {}
        self.veichules = {}
        self.sort = {}

    def make_monitor(self):
        
        self.conditon_monitor = [
            "    _____________________________________________   _______________________________________________________________________",
            "   |  Moniteur de condition:                     | |  Atributs:                                                            |",
            "   |  Physique:                     Etroudissant:| |                                                                       |",
            "   | ____________   _____________   ____________ | |  Physiques:     Mantaux:     Spéciaux:                                |",
            "   | " + self.p[0] + " | " + self.p[1] + " | " + self.p[2] + " -1| | " + self.p[15] + " | " + self.p[
                16] + " | " + self.p[17] + " -6| | " + self.e[0] + " | " + self.e[1] + " | " + self.e[
                2] + " -1| |                                                                       |",
            "   | " + self.p[3] + " | " + self.p[4] + " | " + self.p[5] + " -2| | " + self.p[18] + " | " + self.p[
                19] + " | " + self.p[20] + " -7| | " + self.e[3] + " | " + self.e[4] + " | " + self.e[
                5] + " -2| |   CON:           VOL:         CHC:         INIT:         LIMITE:      |",
            "   | " + self.p[6] + " | " + self.p[7] + " | " + self.p[8] + " -3| | " + self.p[21] + " | " + self.p[
                22] + " | " + self.p[23] + " -8| | " + self.e[6] + " | " + self.e[7] + " | " + self.e[
                8] + " -3| |   AGI:           LOG:         Left:        Physique:     Physique:    |",
            "   | " + self.p[9] + " | " + self.p[10] + " | " + self.p[11] + " -4| | " + self.p[24] + " | " + self.p[
                25] + " | " + self.p[26] + " -9| | " + self.e[9] + " | " + self.e[10] + " | " + self.e[
                11] + " -4| |   REA:           INT:         ESS:         Matrice:      Mentale:     |",
            "   | " + self.p[12] + " | " + self.p[13] + " | " + self.p[14] + " -5| | " + self.p[27] + " | " + self.p[
                28] + " | " + self.p[29] + " -9| | " + self.e[12] + " | " + self.e[13] + " | " + self.e[
                14] + " -5| |   FOR:           CHA:         MAG:         Astral:       Sociale:     |",
            "    -------------  ---------------  -------------   -----------------------------------------------------------------------"]

    def life_point(self):
        for i in range(30):
            if i < self.mc_phys:
                self.p[i] = "*"
            else:
                self.p[i] = " "
        for i in range(15):
            if i < self.mc_etour:
                self.e[i] = "*"
            else:
                self.e[i] = " "

    def tiny_sheet(self):

        self.life_point()
        self.make_monitor()

        for line in self.conditon_monitor:
            print(colored(line, "green"))
