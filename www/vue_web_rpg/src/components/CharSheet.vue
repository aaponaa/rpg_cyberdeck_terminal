<template>

</template>

<script>
export default {
  name: "ThePage"
}
// Verify the JSON is JSON
// https://jsonformatter.curiousconcept.com/
// Minify the JSON for use below
// https://www.cleancss.com/json-minify/
// Minify the HTML node
// https://www.willpeavy.com/minifier/
// Escape the HTML for the JSON
// https://www.freeformatter.com/json-escape.html

function ParseJSON(data, elmID, nodeType) {
  try {

    // Get the data we need
    const charSheet = data;
    const divContainer = document.getElementById(elmID);
    divContainer.innerHTML = "";
    const filteredNodes = charSheet.items;

    // For that iterates on the JSON items
    for (let a = 0; a < filteredNodes.length; a++) {
      let item = filteredNodes[a];

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
        // Attributes
        if (item.attributes !== undefined) {
          var attrs = Object.keys(item.attributes);
          var attrVals = Object.values(item.attributes);
          var dl = document.createElement("dl");


          for (let i = 0; i < attrs.length; i++) {
            var dt = document.createElement("dt");
            dt.innerHTML = attrs[i];
            dl.appendChild(dt);
            var dd = document.createElement("dd");
            dd.innerHTML = attrVals[i];
            dl.appendChild(dd);
          }
        }

        // Boxes
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
          p.innerHTML = "<strong>Notes:</strong> " + item.Notes;
        }

        // Data grid
        if (item.table !== undefined && item.row !== undefined) {
          var table = document.createElement("table");
          var caption = document.createElement("caption");
          caption.innerHTML = item.table;
          table.appendChild(caption);

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
              tabCell.innerHTML = tableCells[k];
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
          article.appendChild(dl);
        }
        if (item.Boxes !== undefined) {
          article.appendChild(pB);
        }
        if (item.Notes !== undefined) {
          article.appendChild(p);
        }
        if (item.table !== undefined && item.row !== undefined) {
          article.appendChild(table);
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
const url ='http://localhost:8080/sheet/get/1'

fetch(url,
    {
      method: 'GET'
    }
) .then(response => response.json())

    .then(response => {
      ParseJSON(response, "Core", "Core");
      ParseJSON(response, "Magic", "Magic");
      ParseJSON(response, "Cyber", "Cyber");
      ParseJSON(response, "VehicleDrone", "VehicleDrone");
      ParseJSON(response, "Notes", "Notes");
    });



</script >



<style scoped>

</style>