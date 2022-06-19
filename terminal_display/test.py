from __future__ import annotations

from typing import Any


class Alignment:
    CENTER = "center"
    START = "start"
    END = "end"


class TerminalVerticalSeparator:

    def to_str(self, width: int) -> str:
        return "-" * width


class HasLines:

    def lines(self):
        return []


class TerminalGridElement:
    value: Any = None
    row: int = None
    col: int = None
    rowspan: int = 1
    colspan: int = 1
    alignment: str | None = None

    def __init__(self, value: str, row: int, col: int, rowspan: int = 1, colspan: int = 1, alignment=None):
        self.value = value
        self.row = row
        self.col = col
        self.rowspan = rowspan
        self.colspan = colspan
        self.alignment = alignment

    def to_str(self, width: int) -> str:
        match self.alignment:
            case Alignment.END:
                return self.value.rjust(width)
            case Alignment.CENTER:
                remaining_width = width - len(self.value)
                left = remaining_width // 2
                right = left + remaining_width % 2
                return " " * left + self.value + " " * right
            case Alignment.START | _:
                return self.value.ljust(width)


class TerminalRow:
    __width: int = None
    __alignment: str | None = None
    __columns: [TerminalGridElement] = []

    def __init__(self, width, alignment=None):
        self.__width = width
        self.__alignment = alignment

    def columns(self, *elements: [TerminalGridElement]) -> TerminalRow:
        self.__columns = [e for e in elements]
        return self

    def add_column(self, column, alignment=None) -> TerminalRow:
        self.__columns.append(TerminalGridElement(column, alignment))
        return self

    def __repr__(self):
        column_widths = [self.__width // len(self.__columns) for i in range(len(self.__columns))]
        remainder = self.__width % len(self.__columns)
        col = 0
        while remainder > 0:
            column_widths[col] += 1
            remainder -= 1
            col = (col + 1) % len(self.__columns)

        s = ""
        for (terminal_element, column_width) in zip(self.__columns, column_widths):
            s += terminal_element.to_str(column_width)

        return s

    def display(self):
        print(self)


class GridConfiguration:
    width: int = None
    left_border: bool = True
    right_border: bool = True
    top_border: bool = True
    bottom_border: bool = True

    def __init__(self, width: int, left_border: bool = True, right_border: bool = True, top_border: bool = True,
                 bottom_border: bool = True):
        self.width = width
        self.left_border = left_border
        self.right_border = right_border
        self.top_border = top_border
        self.bottom_border = bottom_border


class TerminalGrid:
    __padding: int = 0
    __col_sep: str = None
    __row_sep: str = None
    __grid: dict = {}

    def __init__(self, padding=0, col_sep=None, row_sep=None):
        self.__padding = padding
        self.__col_sep = col_sep
        self.__row_sep = row_sep

    def add(self, value: Any, row: int, col: int, rowspan: int = 1, colspan: int = 1,
            alignment=Alignment.START) -> TerminalGrid:
        if row not in self.__grid:
            self.__grid[row] = {}

        self.__grid[row][col] = {
            "element": value,
            "rowspan": rowspan,
            "colspan": colspan,
            "alignment": alignment
        }
        return self

        # self.__elements.append(TerminalGridElement(value, row, col, rowspan, colspan, alignment))

        # def add_row(self, *columns: [TerminalElement]) -> TerminalGrid:
        #     self.__rows.append(TerminalRow(width=self.__width - 2 * self.__padding).columns(*columns))
        #     return self

    def lines(self, width: int, borders: dict) -> iter:
        if borders["top"] is not False:
            yield self.__start_line(width)
        rows = self.__rows()
        cols = self.__cols()
        column_widths = self.__column_widths(width, cols)
        slines = [[] for _ in range(rows)]
        for row in range(rows):
            if row not in self.__grid:
                slines[row].append(self.__pad(self.__format("", sum(column_widths), Alignment.START)))
            parts = []
            for (ix, col) in enumerate(range(cols)):
                element = None
                next_col = col + 1
                alignment = Alignment.START
                if col in self.__grid[row]:
                    e = self.__grid[row][col]
                    element = e["element"]
                    next_col = col + e["colspan"]
                    alignment = e["alignment"]
                else:
                    element = ""
                    next_col = col + 1
                    while next_col not in row:
                        next_col += 1

                if isinstance(element, str):
                    slines[row].append(self.__pad(self.__format(element, sum(column_widths[col:next_col]), alignment)))
                elif isinstance(element, TerminalGrid):
                    sb = {
                        "left": col > 0,
                        "right": col < cols - 1,
                        "top": row > 0,
                        "bottom": row < rows - 1
                    }
                    i = 0
                    for line in element.lines(sum(column_widths[col:next_col]), sb):
                        if i < len(slines) - 1:
                            slines.append([])
                        slines[i].append(line)
                        i += 1
                        print(i)

            # slines.append(self.__line(("" if self.__col_sep is None else self.__col_sep).join(parts)))
        for scols in slines:
            yield self.__line(("" if self.__col_sep is None else self.__col_sep).join(scols),
                              borders["left"] is not False,
                              borders["right"] is not False)

        if borders["bottom"] is not False:
            yield self.__start_line(width)

    def __rows(self) -> int:
        rows = 0
        for (row, cols) in self.__grid.items():
            for (col, value) in cols.items():
                m = row + value["rowspan"]
                if m > rows:
                    rows = m
        return rows

    def __cols(self) -> int:
        cols = 0
        for row in self.__grid.values():
            for (col, value) in row.items():
                m = col + value["colspan"]
                if m > cols:
                    cols = m
        return cols
        # return max(list(
        #     map(lambda x: max(list(map(lambda keyvalue: keyvalue[0] + keyvalue[1]["colspan"], x.items()))), rows)))

    def __column_widths(self, width: int, cols: int) -> [int]:
        column_widths = [width // cols for _ in range(cols)]
        remainder = width % cols
        col = 0
        while remainder > 0:
            column_widths[col] += 1
            remainder -= 1
            col = (col + 1) % cols
        return [w - 2 * self.__padding - (0 if self.__col_sep is None else len(self.__col_sep)) for w in column_widths]

    def to_str(self, width: int, borders: dict = {"left": True, "right": True, "top": True, "bottom": True}) -> str:
        return "\n".join([line for line in self.lines(width, borders)])

    def __start_line(self, width: int) -> str:
        return " " * self.__padding + "-" * width + " " * self.__padding

    def __line(self, line: str, left_border: bool = True, right_border: bool = True) -> str:
        return ("|" if left_border else "") + line + ("|" if right_border else "")

    def __pad(self, value: str) -> str:
        return self.__padding * " " + value + self.__padding * " "

    @staticmethod
    def __format(value: str, width: int, alignment: str) -> str:
        match alignment:
            case Alignment.END:
                return value.rjust(width)
            case Alignment.CENTER:
                remaining_width = width - len(value)
                left = remaining_width // 2
                right = left + remaining_width % 2
                return " " * left + value + " " * right
            case Alignment.START | _:
                return value.ljust(width)


"""
    _____________________________________________   _______________________________________________________________________
   | Moniteur de condition:                      | |  Atributs:                                                            |
   | Physique:                     Etroudissant: | |                                                                       |
   | ____________   _____________   ____________ | |  Physiques:     Mantaux:     Spéciaux:                                |
   | * | * | * -1| |   |   |   -6| |   |   |   -1| |                                                                       |
   | * | * | * -2| |   |   |   -7| |   |   |   -2| |   CON:           VOL:         CHC:         INIT:         LIMITE:      |
   | * | * |   -3| |   |   |   -8| |   |   |   -3| |   AGI:           LOG:         Left:        Physique:     Physique:    |
   |   |   |   -4| |   |   |   -9| |   |   |   -4| |   REA:           INT:         ESS:         Matrice:      Mentale:     |
   |   |   |   -5| |   |   |   -9| |   |   |   -5| |   FOR:           CHA:         MAG:         Astral:       Sociale:     |
    -------------  ---------------  -------------   -----------------------------------------------------------------------

"""

if __name__ == "__main__":

    subcard1 = TerminalGrid(padding=1, col_sep="|")

    k = 8
    for i in range(5):
        for c in range(3):
            subcard1.add("*" if (i * 3 + c) < k else " ", i, c, alignment=Alignment.CENTER)
        subcard1.add("-" + str(i + 1), i, 3, alignment=Alignment.END)

    print("Width 50")
    print(subcard1.to_str(50))
    print()
    print("Width 15")
    print(subcard1.to_str(15))

    card = TerminalGrid(padding=1) \
        .add("test", 0, 0) \
        .add("Physique", 1, 0) \
        .add("Etourdissant", 1, 2) \
        .add(subcard1, 2, 0) \
        .add("test", 2, 1) \
        .add("test", 2, 2)

    print(card.to_str(50))
