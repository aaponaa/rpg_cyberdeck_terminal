from __future__ import annotations

import functools

from termcolor import colored

class Alignment:
    CENTER = "center"
    START = "start"
    END = "end"


class GridElement:

    def __init__(self, value: str, width: int = None, colspan: int = 1, alignment: str = Alignment.START,
                 color: str = None):
        self.value = value
        self.width = width if width is not None else len(value)
        self.colspan = colspan
        self.alignment = alignment
        self.color = color

    def format(self, width: int) -> str:
        formatted = self.value
        if self.alignment == Alignment.END:
            formatted = self.value.rjust(width)
        elif self.alignment == Alignment.CENTER:
            remaining_width = width - len(self.value)
            left = remaining_width // 2
            right = left + remaining_width % 2
            formatted = " " * left + self.value + " " * right
        else:
            formatted = self.value.ljust(width)

        if self.color is None:
            return formatted
        else:
            return colored(formatted, self.color)


class TerminalGrid:
    __padding: int = 0
    __col_sep: str = None
    __row_sep: str = None
    __grid: dict = None

    def __init__(self, padding=1, spacing=1, default_color: str = None):
        self.__padding = padding
        self.__grid = {}
        self.__spacing = spacing
        self.__default_color = default_color

    def add(self, value: str, row: int, col: int, width: int = None, colspan: int = 1,
            alignment: str = Alignment.START, color: str = None) -> TerminalGrid:
        if row not in self.__grid:
            self.__grid[row] = {}
        self.__grid[row][col] = GridElement(value, width, colspan, alignment,
                                            color if color is not None else self.__default_color)
        return self

    def lines(self, border: bool = True):
        cols = max([max([c + col.colspan for (c, col) in row.items()]) for row in self.__grid.values()])
        # Fill column gaps
        for row in sorted(self.__grid.keys()):
            for col in range(cols):
                missing = True
                for (c, e) in self.__grid[row].items():
                    if c <= col < c + e.colspan:
                        missing = False

                if missing:
                    self.__grid[row][col] = GridElement("")

        col_widths = []
        col_weights = []
        for row in sorted(self.__grid.keys()):
            widths = []
            weights = []
            for col in sorted(self.__grid[row].keys()):
                e = self.__grid[row][col]
                widths.extend(self.__column_widths(e.width, e.colspan))
                weights.extend([e.colspan for _ in range(e.colspan)])

            col_widths.append(widths)
            col_weights.append(weights)

        col_widths = [[(col_widths[row][col], col_weights[row][col])
                       for row in range(len(col_widths))] for col in range(cols)]
        for col in range(cols):
            col_widths[col].sort(
                key=functools.cmp_to_key(self.__compare_widths))

        column_widths = [col_widths[col][len(col_widths[col]) - 1][0] for col in range(cols)]
        full_width = sum(column_widths) + 2 + (cols - 1) * self.__spacing

        border_line = self.__color(" " + "-" * full_width + " ")
        if border:
            yield border_line

        for row in sorted(self.__grid.keys()):
            parts = []
            for (j, col) in enumerate(sorted(self.__grid[row].keys())):
                element = self.__grid[row][col]
                col_width = sum(column_widths[col:col + element.colspan]) + (element.colspan - 1) * self.__spacing
                parts.append(element.format(col_width))
            yield self.__color("| " if border else "") + (" " * self.__spacing).join(parts) \
                  + self.__color(" |" if border else "")

        if border:
            yield border_line

    def __color(self, str: str) -> str:
        return str if self.__default_color is None else colored(str, self.__default_color)

    def display(self, border: bool = True):
        print(self.to_str(border))

    def to_str(self, border: bool = True) -> str:
        lines = [line for line in self.lines(border)]
        return "\n".join(lines)

    @staticmethod
    def __column_widths(width: int, nb_columns: int):
        column_widths = [width // nb_columns for _ in range(nb_columns)]
        remainder = width % nb_columns
        col = 0
        while remainder > 0:
            column_widths[col] += 1
            remainder -= 1
            col = (col + 1) % nb_columns
        return column_widths

    @staticmethod
    def __compare_widths(i1, i2):
        if i1[1] == i2[1]:
            return i1[0] - i2[0]
        else:
            return i2[1] - i1[1]
