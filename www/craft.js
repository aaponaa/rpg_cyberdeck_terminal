
const url ='http://localhost:8080/sheet/1'

function editJSON(data, elmID, nodeType) {
    try {

        // Get the data we need
        const charSheet = data;
        const divContainer = document.getElementById(elmID);
        divContainer.innerHTML = "";
        const sheetItems = charSheet.items;

        // For that iterates on the JSON items
        for (let a = 0; a < sheetItems.length; a++) {
            let item = sheetItems[a];

            if (item.card === nodeType) {
                // I have to find a way to filter
                let article = document.createElement("article");
                article.className = item.type
                    .split(" ")
                    .join("-")
                    .toLowerCase();
                article.setAttribute('id', removeSpecialChars(item.name));

                // Always Make Headings
                let h2 = document.createElement("h2");
                let span = document.createElement("span");
                h2.appendChild(span);
                span.innerHTML = item.name;
                if (item.type !== undefined && item.type != "") {
                    span.innerHTML = item.type + ": " + span.innerHTML;
                }
                let span2 = document.createElement("span");
                h2.appendChild(span2);

                // If there is:
                // Attributes make a form with submit button
                if (item.attributes !== undefined ) {
                    var attrs = Object.keys(item.attributes);
                    var attrVals = Object.values(item.attributes);
                    var formu = document.createElement("form");
                    formu.setAttribute("id", item.name)
                    formu.setAttribute("action","http://localhost:8080/sheet/attr/1")
                    formu.setAttribute("method", "post")

                        for (let i = 0; i < attrs.length; i++) {
                            var dt = document.createElement("dt");
                            dt.innerHTML = attrs[i];
                            formu.appendChild(dt);
                            var entr = document.createElement("input");
                            entr.setAttribute("id", attrs[i]);
                            entr.setAttribute("name", attrs[i]);
                            entr.defaultValue = attrVals[i];
                            formu.appendChild(entr);
                        }
                    var s = document.createElement("input");
                    s.setAttribute("type", "submit");
                    formu.appendChild(s);
                }

                // Boxes CondMon Drone:Vehichule
                if (item.Boxes !== undefined) {
                    var pB = document.createElement("p");
                    pB.className = "boxes";
                    var boxen = "";
                    for (var i = 0; i < item.Boxes; i++) {
                        boxen = "<span>◯</span>" + boxen;
                    }
                    pB.innerHTML = "<strong>Condition Monitor:</strong> " + boxen;
                }

                // Notes
                if (item.Notes !== undefined) {
                    var p = document.createElement("p");
                    var textarea = document.createElement("textarea");
                    textarea.setAttribute("name","notes")
                    textarea.setAttribute("rows","10")
                    textarea.setAttribute("cols", "50")
                    p.appendChild(textarea);
                    p.innerHTML = "<strong>Notes:</strong> ";
                }

                // Data grid Row in JSON
                if (item.table !== undefined && item.row !== undefined) {
                    var formu = document.createElement("form");
                    formu.setAttribute("id", item.name);
                    formu.setAttribute("action","http://localhost:8080/sheet/tab/1");
                    formu.setAttribute("method", "post");

                    var table = document.createElement("table");
                    var caption = document.createElement("caption");

                    caption.innerHTML = item.table;
                    formu.appendChild(table);
                    table.appendChild(caption);


                    var but = document.createElement("input");
                    but.setAttribute("type", "submit");
                    formu.appendChild(s)

                    var tableHead = Object.keys(item.row[0]);
                    var tableRows = Object.values(item.row);

                    var tr = table.insertRow(-1);
                    for (var i = 0; i < tableHead.length; i++) {
                        var th = document.createElement("th");
                        th.innerHTML = tableHead[i];
                        tr.appendChild(th);
                    }

                    for (var j = 0; j < tableRows.length; j++) {
                        var tableCells = Object.values(item.row[j]);
                        var tr = table.insertRow(-1);
                        for (var k = 0; k < tableCells.length; k++) {
                            var tabCell = tr.insertCell(-1);
                            var entr = document.createElement("input");
                            let names = Object.keys(item.row[j]);
                            entr.setAttribute("name", names[k]);
                            entr.defaultValue = tableCells[k];
                            tabCell.appendChild(entr)
                        }
                    }
                }

                // Raw HTML
                if (item.HTML !== undefined) {
                    var div = document.createElement("div");
                    div.innerHTML = item.HTML;
                }

                // And then build it:
                divContainer.appendChild(article);
                article.appendChild(h2);
                if (item.attributes !== undefined) {
                    article.appendChild(formu);
                }
                if (item.Boxes !== undefined) {
                    article.appendChild(pB);
                }
                if (item.Notes !== undefined) {
                    article.appendChild(p);
                }
                if (item.table !== undefined && item.row !== undefined) {
                    article.appendChild(formu);
                }
                if (item.HTML !== undefined) {
                    article.appendChild(div);
                }
            }
        }
    } catch (e) {
        // If error
        console.log("ParseJSON(): " + e);
    }
}

// Need a simpler one
function removeSpecialChars(str) {
    return str.replace(/(?!\w|\s)./g, '')
        .replace(/\s+/g, ' ')
        .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2')
        .replace(" ","")
        .replace(" ","");
}

// Api sheet.json call

function getSheet() {
    fetch(url,
        {
            method: 'GET'
        }
    ).then(response => response.json())

        .then(response => {
            editJSON(response, "Core", "Core");
            editJSON(response, "Magic", "Magic");
            editJSON(response, "Cyber", "Cyber");
            editJSON(response, "VehicleDrone", "VehicleDrone");
            editJSON(response, "Notes", "Notes");
        })
}

getSheet();