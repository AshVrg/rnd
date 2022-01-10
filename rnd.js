var Randomizer = {
    students: {},
    numberOfStudents: 0,
    element: undefined,
    latestOp: "random",
  
    init: function() {
      var attendees = document.getElementsByClassName("name");
  
      if (attendees.length == 0) {
        return;
      }
      var el = document.createElement("div");
      el.style.width = "80%";
      el.style.height = "90%";
      el.style.zIndex = 4711;
      el.style.margin = "0";
      el.style.padding = "15px";
      el.style.left = "10%";
      el.style.position = "absolute";
      el.style.fontFamily = "Roboto";
      el.style.fontWeight = 300;
      el.style.backgroundColor = "white";
      el.style.overflowY = "scroll";
  
      el.id = "peksa_randomizer";
  
      Randomizer.element = el;
  
      document.body.appendChild(el);
  
      var a = document.createElement("a");
      a.href = "#";
      a.addEventListener("click", function(e) { Randomizer.randomize(); e.preventDefault(); return false; });
      a.innerText = "Random order";
      a.style.fontSize = "16pt";
      a.className = "clickable";
      el.appendChild(a);
  
      el.appendChild(document.createTextNode(" - "));
  
      var a = document.createElement("a");
      a.href = "#";
      a.addEventListener("click", function(e) { Randomizer.createGroups(2); e.preventDefault(); return false; });
      a.innerText = "Groups of 2";
      a.style.fontSize = "16pt";
      a.className = "clickable";
      el.appendChild(a);
  
      el.appendChild(document.createTextNode(" - "));
  
      var a = document.createElement("a");
      a.href = "#";
      a.addEventListener("click", function(e) { Randomizer.createGroups(3); e.preventDefault(); return false; });
      a.innerText = "Groups of 3";
      a.style.fontSize = "16pt";
      a.className = "clickable";
      el.appendChild(a);
  
      el.appendChild(document.createTextNode(" - "));
  
      var a = document.createElement("a");
      a.href = "#";
      a.addEventListener("click", function(e) { Randomizer.createGroups(prompt('Groups of what size?')); e.preventDefault(); return false; });
      a.innerText = "Groups of x";
      a.style.fontSize = "16pt";
      a.className = "clickable";
      el.appendChild(a);
  
  
      var a = document.createElement("a");
      a.href = "#";
      a.addEventListener("click", function(e) { Randomizer.close(); e.preventDefault(); return false; });
      a.innerText = "Close";
      a.style.float = "right";
      el.appendChild(a);
  
      var diff = document.createElement("span");
      diff.innerHTML = "&nbsp;-&nbsp;";
      diff.style.float = "right";
      el.appendChild(diff);
  
      var a = document.createElement("a");
      a.href = "#";
      a.addEventListener("click", function(e) { Randomizer.save(); e.preventDefault(); return false; });
      a.innerText = "Save";
      a.style.float = "right";
      a.className = "clickable";
      el.appendChild(a);
  
      for (var i = 0; i < attendees.length; i++) {
        var student = document.createElement("div");
        var attendance = true;
        try {
          var str = attendees[i].parentNode.getElementsByClassName("fast-listbox-label-width-min")[0].innerText;
          attendance = str === "Attending" || str === "Närvarande";
        } catch (e) {
          // ignore
        }
  
        Randomizer.addStudent(attendees[i].innerText, attendance);
      }
  
    },
  
    addStudent: function(name, attending) {
      var el = document.createElement("div");
      if (!attending) {
        el.style.color = "grey";
      }
      el.innerText = name + " - ";
      var closeLink = document.createElement("a");
      closeLink.href = "#";
      closeLink.addEventListener("click", (function(id) { return function(e) { Randomizer.removeStudent(id); e.preventDefault(); return false; }})(Randomizer.numberOfStudents));
      closeLink.innerText = "Remove";
      el.appendChild(closeLink);
      el.style.fontWeight = "bold";
      el.style.position = "absolute";
      var y = Randomizer.numberOfStudents * 22 + 50;
      el.style.top = y + "px";
      el.style.left = "15px";
      el.style.transition = "all 0.5s ease"
  
      var student = {
        id: Randomizer.numberOfStudents,
        position: Randomizer.numberOfStudents,
        name: name,
        attending: attending,
        element: el,
        y: y,
      };
      Randomizer.element.appendChild(el);
      Randomizer.students[Randomizer.numberOfStudents] = student;
      Randomizer.numberOfStudents++;
    },
  
    removeStudent: function(id) {
      var el = Randomizer.students[id].element;
      el.parentNode.removeChild(el);
      delete Randomizer.students[id];
      Randomizer.numberOfStudents--;
      Randomizer.recalculatePositions();
    },
  
    disableLinks: function() {
      var links = document.getElementsByClassName("clickable");
      for (var i = 0; i < links.length; i++) {
        links[i].style.pointerEvents = "none";
        links[i].style.color = "grey";
        links[i].style.textDecoration = "none";
      }
    },
  
    enableLinks: function() {
      var links = document.getElementsByClassName("clickable");
      for (var i = 0; i < links.length; i++) {
        links[i].style.pointerEvents = "";
        links[i].style.color = "";
        links[i].style.textDecoration = "underline";
      }
    },
  
    recalculatePositions: function() {
      var ids = Object.keys(Randomizer.students);
      for (var i = 0; i < ids.length; i++) {
        Randomizer.students[ids[i]].position = i;
        Randomizer.students[ids[i]].element.style.top = (i*22+50) + "px";
        Randomizer.students[ids[i]].element.style.left = "15px";
      }
    },
  
    addNumbersToStudents: function() {
      var ids = Object.keys(Randomizer.students);
      for (var i = 0; i < ids.length; i++) {
        var student = Randomizer.students[ids[i]];
        var span = document.createElement("span");
        span.innerText = student.position+1 + ". ";
        student.element.insertAdjacentElement("afterBegin", span);
      }
    },
  
    randomize: function(callback) {
      Randomizer.recalculatePositions();
      Randomizer.latestOp = "random";
      Randomizer.disableLinks();
      var groups = document.getElementById("groups");
      if (groups) {
        groups.parentNode.removeChild(groups);
      }
      var ids = Object.keys(Randomizer.students);
  
      for (var i = 0; i < ids.length; i++) {
        var el = Randomizer.students[ids[i]].element;
        el.style.color = "black";
        var link = el.getElementsByTagName("a")[0];
        if (link) {
          el.removeChild(link);
          el.innerText = el.innerText.slice(0, el.innerText.length-2);
        }
        var num = el.getElementsByTagName("span")[0];
        if (num) {
          el.removeChild(num);
        }
      }
      for (var count = 0; count < 5; count++) {
        for (var i = ids.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
  
          // swap ids[i] and ids[j]
          var temp = ids[i];
          ids[i] = ids[j];
          ids[j] = temp;
  
          (function swap(a, b, i, count) {
            setTimeout(function() {
              var elAtop = Randomizer.students[a].element.style.top;
              var elBtop = Randomizer.students[b].element.style.top;
              Randomizer.students[a].element.style.top = elBtop;
              Randomizer.students[b].element.style.top = elAtop;
  
              var pos1 = Randomizer.students[a].position;
              var pos2 = Randomizer.students[b].position;
  
              Randomizer.students[b].position = pos1;
              Randomizer.students[a].position = pos2;
  
            }, count*50+i*50);
  
          })(ids[i], ids[j], i, count);
  
        }
      }
  
      setTimeout(function() {
        if (callback) {
          callback();
        } else {
          Randomizer.addNumbersToStudents();
          Randomizer.enableLinks();
        }
      }, 350+count*50+ids.length*50);
  
    },
  
    createGroups: function(size) {
      if (!size || size <= 0) {
        return;
      }
      Randomizer.randomize(function() {
        Randomizer.latestOp = "group";
        var ids = Object.keys(Randomizer.students);
        var numGroups;
        if (size <= 3) {
          numGroups = Math.floor(ids.length/size);
        } else {
          numGroups = Math.ceil(ids.length/size);
        }
        var groups = document.createElement("div");
        groups.style.position = "absolute";
        groups.style.top = "50px";
        groups.style.left = "200px";
        groups.style.width = "80%";
        groups.id = "groups";
        Randomizer.element.appendChild(groups);
        var g = [];
        for (var i = 0; i < numGroups; i++) {
          var div = document.createElement("div");
          div.style.float = "left";
          div.style.padding = "5px";
          div.style.margin = "10px";
          div.style.border = "2px solid black";
          var title = document.createElement("h4");
          title.style.textDecoration = "underline";
          title.style.margin = "5px";
          title.style.padding = "5px";
          title.style.paddingLeft = "0";
          title.innerText = "Group " + (i+1);
          div.appendChild(title);
          groups.appendChild(div);
          g[i+1] = div;
        }
        ids.sort(function(a, b) {
          return Randomizer.students[b].position - Randomizer.students[a].position;
        });
        for (var i = 0; i < ids.length; i++) {
          var student = Randomizer.students[ids[i]];
          student.group = numGroups-(i % numGroups);
          var invi = document.createElement("div");
          invi.style.color = "white";
          invi.innerText = student.name;
          invi.style.zIndex = -10;
          student.invi = invi;
          //	g[student.group].appendChild(invi);
          var title = g[student.group].getElementsByTagName("h4")[0];
          title.insertAdjacentElement("afterEnd", invi);
        }
  
        for (var i = 0; i < ids.length; i++) {
          var student = Randomizer.students[ids[i]];
          (function move(student) {
            setTimeout(function() {
              student.element.style.left = (student.invi.offsetLeft+200) + "px";
              student.element.style.top = (student.invi.offsetTop+50) + "px";
              student.element.style.zIndex = 10;
            }, student.position*50);
          })(student)
        }
  
        setTimeout(function() {
          Randomizer.enableLinks();
        }, i*50+250);
      });
    },
  
    close: function() {
      var old = document.getElementById("peksa_randomizer");
      if (old) {
        old.parentNode.removeChild(old);
      }
      var loader = document.getElementById("peksa_loader");
      if (loader) {
        loader.parentNode.removeChild(loader);
      }
    },
  
    save: function() {
      var str = "";
  
      var ids = Object.keys(Randomizer.students);
  
      ids.sort(function(one, two) {
        var a = Randomizer.students[one];
        var b = Randomizer.students[two];
        if (Randomizer.latestOp == "random" || a.group == b.group) {
          return a.position - b.position;
        } else {
          return a.group - b.group;
        }
      });
  
      var g = "";
      if (Randomizer.latestOp == "group") {
        for (var i = 0; i < ids.length; i++) {
          var s = Randomizer.students[ids[i]];
          if (s.group !== g) {
            str += "\nGroup " + s.group + "\n";
            str += "========\n"
            g = s.group;
          }
          str += s.name + "\n";
        }
      } else {
        for (var i = 0; i < ids.length; i++) {
          var s = Randomizer.students[ids[i]];
          str += (s.position+1) + ". " + s.name + "\n";
        }
      }
      var blob = new Blob([str], {type: 'text/plain'});
      window.open(URL.createObjectURL(blob));
    }
  };
  
  Randomizer.close();
  Randomizer.init();