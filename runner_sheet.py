from termcolor import colored

from terminal_display.terminal_grid import TerminalGrid


class RunnerSheet:

    def __init__(self):
        # self.info = pd.read_csv("saves/sheet_data.csv")

        self.mc_etour = 0
        self.mc_phys = 6
        self.physical_damage = 7
        self.stun_damage = 0
        self.attributes = {
            "physical": {
                "CON": None,
                "AGI": None,
                "REA": None,
                "FOR": None
            },
            "mental": {
                "VOL": None,
                "LOG": None,
                "INT": None,
                "CHA": None
            },
            "special": {
                "CHC": None,
                "Left": None,
                "ESS": None,
                "MAG": None
            }
        }
        self.initiatives = {
            "physical": None,
            "matrix": None,
            "astral": None
        }

        self.limit = {
            "physical": None,
            "mental": None,
            "social": None
        }

        # Avantages et Défauts
        self.advantages = []
        self.defaults = []

        # Compétences
        self.skills = {}

        # Armes
        self.weapons = {}
        self.augments = {}
        self.vehicles = {}
        self.spells = {}

        self.p = {}
        self.e = {}

    def display_monitor(self, default_color: str = "green"):

        condition_monitor_card = TerminalGrid(padding=1, default_color=default_color) \
            .add("Moniteur de condition", 0, 0, colspan=5) \
            .add("Physique", 1, 0) \
            .add("Etourdissant", 1, 4) \
            .add("________________", 2, 0) \
            .add("________________", 2, 2) \
            .add("________________", 2, 4)

        colored_threshold = lambda t, d: colored(str(max(-9, -t - 1)), default_color) if (t + 1) * 3 > d \
            else colored(str(max(-9, -t - 1)), "red")
        damages = lambda t, d: [colored("*", "yellow") if d > t * 3 + k else " " for k in range(3)]
        damage_line = lambda t, d: colored(" | ", default_color).join(damages(t, d) + [colored_threshold(t, d)])

        for threshold in range(10):
            condition_monitor_card.add(
                " " + damage_line(threshold, self.physical_damage) + " ",
                3 + threshold % 5,
                2 * (threshold // 5),
                width=16)
            condition_monitor_card.add(colored("|", default_color), 3 + threshold % 5, 1 + 2 * (threshold // 5),
                                       width=1)

        for threshold in range(5):
            condition_monitor_card.add(
                " " + damage_line(threshold, self.stun_damage) + " ",
                3 + threshold,
                4,
                width=16)

        attributes_card = TerminalGrid(default_color="green") \
            .add(" Attributs", 0, 0, colspan=5) \
            .add("", 1, 0, colspan=5) \
            .add(" Physiques", 2, 0, width=10) \
            .add(" Mentaux", 2, 1, width=10) \
            .add(" Spéciaux", 2, 2, width=10) \
            .add("", 3, 0, colspan=5)

        attr_label = lambda k, v: (k + ": ") + (str(v) if v is not None else "")

        for (i, attr) in enumerate(["CON", "AGI", "REA", "FOR"]):
            attributes_card.add("  " + attr_label(attr, self.attributes["physical"][attr]), 4 + i, 0, width=10)

        for (i, attr) in enumerate(["VOL", "LOG", "INT", "CHA"]):
            attributes_card.add("  " + attr_label(attr, self.attributes["mental"][attr]), 4 + i, 1, width=10)

        for (i, attr) in enumerate(["CHC", "Left", "ESS", "MAG"]):
            attributes_card.add("  " + attr_label(attr, self.attributes["special"][attr]), 4 + i, 2, width=10)

        attributes_card.add("INIT ", 4, 3)
        attributes_card.add(attr_label("Physique", self.initiatives["physical"]), 5, 3, width=13)
        attributes_card.add(attr_label("Matrice", self.initiatives["matrix"]), 6, 3, width=13)
        attributes_card.add(attr_label("Astral", self.initiatives["astral"]), 7, 3, width=13)
        attributes_card.add("LIMITE ", 4, 4)
        attributes_card.add(attr_label("Physique", self.limit["physical"]), 5, 4, width=13)
        attributes_card.add(attr_label("Mentale", self.limit["mental"]), 6, 4, width=13)
        attributes_card.add(attr_label("Sociale", self.limit["social"]), 7, 4, width=13)

        for (l1, l2) in zip(condition_monitor_card.lines(), attributes_card.lines()):
            print("  " + l1 + " " + l2)

    def damage(self, dtype: str, nb: int = 1):
        if dtype == "physical":
            self.physical_damage += nb
        elif dtype == "stun":
            self.stun_damage += nb

    def heal(self, type: str, nb: int = 1):
        self.damage(type, -nb)

    # def make_monitor(self):
    #
    #     self.conditon_monitor = [
    #         "    _____________________________________________   _______________________________________________________________________",
    #         "   |  Moniteur de condition:                     | |  Atributs:                                                            |",
    #         "   |  Physique:                     Etroudissant:| |                                                                       |",
    #         "   | ____________   _____________   ____________ | |  Physiques:     Mantaux:     Spéciaux:                                |",
    #         "   | " + self.p[0] + " | " + self.p[1] + " | " + self.p[2] + " -1| | " + self.p[15] + " | " + self.p[
    #             16] + " | " + self.p[17] + " -6| | " + self.e[0] + " | " + self.e[1] + " | " + self.e[
    #             2] + " -1| |                                                                       |",
    #         "   | " + self.p[3] + " | " + self.p[4] + " | " + self.p[5] + " -2| | " + self.p[18] + " | " + self.p[
    #             19] + " | " + self.p[20] + " -7| | " + self.e[3] + " | " + self.e[4] + " | " + self.e[
    #             5] + " -2| |   CON:           VOL:         CHC:         INIT:         LIMITE:      |",
    #         "   | " + self.p[6] + " | " + self.p[7] + " | " + self.p[8] + " -3| | " + self.p[21] + " | " + self.p[
    #             22] + " | " + self.p[23] + " -8| | " + self.e[6] + " | " + self.e[7] + " | " + self.e[
    #             8] + " -3| |   AGI:           LOG:         Left:        Physique:     Physique:    |",
    #         "   | " + self.p[9] + " | " + self.p[10] + " | " + self.p[11] + " -4| | " + self.p[24] + " | " + self.p[
    #             25] + " | " + self.p[26] + " -9| | " + self.e[9] + " | " + self.e[10] + " | " + self.e[
    #             11] + " -4| |   REA:           INT:         ESS:         Matrice:      Mentale:     |",
    #         "   | " + self.p[12] + " | " + self.p[13] + " | " + self.p[14] + " -5| | " + self.p[27] + " | " + self.p[
    #             28] + " | " + self.p[29] + " -9| | " + self.e[12] + " | " + self.e[13] + " | " + self.e[
    #             14] + " -5| |   FOR:           CHA:         MAG:         Astral:       Sociale:     |",
    #         "    -------------  ---------------  -------------   -----------------------------------------------------------------------"]
    #
    # def life_point(self):
    #     for i in range(30):
    #         if i < self.mc_phys:
    #             self.p[i] = "*"
    #         else:
    #             self.p[i] = " "
    #     for i in range(15):
    #         if i < self.mc_etour:
    #             self.e[i] = "*"
    #         else:
    #             self.e[i] = " "

    def tiny_sheet(self):
        self.display_monitor()
