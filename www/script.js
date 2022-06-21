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

   var JSONdata = data;

   var divContainer = document.getElementById(elmID);
   divContainer.innerHTML = "";

   var filteredNodes = JSONdata.items;

   for (var a = 0; a < filteredNodes.length; a++) {
     var json = filteredNodes[a];
     if (json.card === nodeType) {
       // I have to find a way to filter
       var article = document.createElement("article");
       article.className = json.type
         .split(" ")
         .join("-")
         .toLowerCase();
       article.setAttribute('id', removeSpecialChars(json.name));

       // heading
       var h2 = document.createElement("h2");
       var span = document.createElement("span");
       h2.appendChild(span);
       span.innerHTML = json.name;
       if (json.type !== undefined && json.type != "") {
         span.innerHTML = json.type + ": " + span.innerHTML;
       }
       var span2 = document.createElement("span");
       h2.appendChild(span2);

       // attributes
       if (json.attributes !== undefined) {
         var attrs = Object.keys(json.attributes);
         var attrVals = Object.values(json.attributes);
         var dl = document.createElement("dl");
         for (var i = 0; i < attrs.length; i++) {
           var dt = document.createElement("dt");
           dt.innerHTML = attrs[i];
           dl.appendChild(dt);
           var dd = document.createElement("dd");
           dd.innerHTML = attrVals[i];
           dl.appendChild(dd);
         }
       }

       // boxes
       if (json.Boxes !== undefined) {
         var pB = document.createElement("p");
         pB.className = "boxes";
         var boxen = "";
         for (var i = 0; i < json.Boxes; i++) {
           boxen = "<span>◯</span>" + boxen;
         }
         pB.innerHTML = "<strong>Condition Monitor:</strong> " + boxen;
       }

       // notes
       if (json.Notes !== undefined) {
         var p = document.createElement("p");
         p.innerHTML = "<strong>Notes:</strong> " + json.Notes;
       }

       // data grid
       if (json.table !== undefined && json.row !== undefined) {
         var table = document.createElement("table");
         var caption = document.createElement("caption");
         caption.innerHTML = json.table;
         table.appendChild(caption);

         var tableHead = Object.keys(json.row[0]);
         var tableRows = Object.values(json.row);

         var tr = table.insertRow(-1);
         for (var i = 0; i < tableHead.length; i++) {
           var th = document.createElement("th");
           th.innerHTML = tableHead[i];
           tr.appendChild(th);
         }

         for (var j = 0; j < tableRows.length; j++) {
           var tableCells = Object.values(json.row[j]);
           var tr = table.insertRow(-1);
           for (var k = 0; k < tableCells.length; k++) {
             var tabCell = tr.insertCell(-1);
             tabCell.innerHTML = tableCells[k];
           }
         }
       }

       // raw HTML
       if (json.HTML !== undefined) {
         var div = document.createElement("div");
         div.innerHTML = json.HTML;
       }

       // build it
       divContainer.appendChild(article);
       article.appendChild(h2);
       if (json.attributes !== undefined) {
         article.appendChild(dl);
       }
       if (json.Boxes !== undefined) {
         article.appendChild(pB);
       }
       if (json.Notes !== undefined) {
         article.appendChild(p);
       }
       if (json.table !== undefined && json.row !== undefined) {
         article.appendChild(table);
       }
       if (json.HTML !== undefined) {
         article.appendChild(div);
       }
     }
   }
 } catch (e) {
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

let url ='http://localhost:8080/sheet/2'

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

