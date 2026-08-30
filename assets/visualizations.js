(function () {
  "use strict";

  const labels = [
    "R &<br>reproducible analysis",
    "Statistical<br>modeling",
    "Data<br>visualization",
    "Survey<br>design",
    "Bioinformatics",
    "Machine<br>learning",
    "R Shiny /<br>web apps",
    "Scientific<br>writing"
  ];
  const current = [9.5, 8.0, 9.0, 8.2, 6.5, 7.5, 7.0, 7.8];
  const goal = [10.0, 10.0, 10.0, 10.0, 8.0, 10.0, 8.0, 9.0];
  const closeLoop = values => values.concat(values[0]);

  function drawRadar() {
    const host = document.getElementById("skills-radar");
    if (!host || typeof Plotly === "undefined") return;
    const theta = labels.concat(labels[0]);
    const data = [
      {
        type: "scatterpolar", mode: "lines+markers", name: "Learning goal",
        r: closeLoop(goal), theta, fill: "toself",
        fillcolor: "rgba(205,177,230,.20)",
        line: { color: "#c9a9df", width: 3 },
        marker: { color: "#c9a9df", size: 10, line: { color: "white", width: 2 } },
        hovertemplate: "<b>%{theta}</b><br>Learning goal: %{r:.1f}/10<extra></extra>"
      },
      {
        type: "scatterpolar", mode: "lines+markers", name: "Current confidence",
        r: closeLoop(current), theta, fill: "toself",
        fillcolor: "rgba(141,99,184,.28)",
        line: { color: "#8d63b8", width: 4 },
        marker: { color: "#8d63b8", size: 11, line: { color: "white", width: 2 } },
        hovertemplate: "<b>%{theta}</b><br>Current confidence: %{r:.1f}/10<extra></extra>"
      }
    ];
    const layout = {
      autosize: true,
      margin: { t: 70, r: 170, b: 95, l: 170 },
      paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
      font: { family: "Inter, system-ui, sans-serif", color: "#403746", size: 15 },
      showlegend: true,
      legend: {
        x: .98, y: .98, xanchor: "right", yanchor: "top",
        bgcolor: "rgba(247,241,251,.94)", bordercolor: "#d8bfe9", borderwidth: 1,
        font: { size: 13 }, orientation: "v"
      },
      polar: {
        domain: { x: [.02, .98], y: [.02, .98] }, bgcolor: "rgba(0,0,0,0)",
        radialaxis: {
          visible: true, range: [0,10], tickvals: [2,4,6,8,10],
          tickfont: { size: 11, color: "#8b7e91" }, gridcolor: "#e8ddf1", linecolor: "#e8ddf1"
        },
        angularaxis: {
          direction: "clockwise", rotation: 90, gridcolor: "#e8ddf1", linecolor: "#e8ddf1",
          tickfont: { size: 14, color: "#403746" }
        }
      }
    };
    const config = {
      responsive: true, displaylogo: false, scrollZoom: true,
      modeBarButtonsToRemove: ["select2d","lasso2d","autoScale2d"],
      toImageButtonOptions: { format: "png", filename: "zihan-hei-skills-radar", scale: 2 }
    };
    Plotly.newPlot(host, data, layout, config);
  }

  function drawToolsNetwork() {
    const host = document.getElementById("tools-network-plotly");
    if (!host || typeof Plotly === "undefined") return;

    const colors = {
      r: "#5f88c5",
      apps: "#9d63bd",
      python: "#5da45c",
      workflow: "#e6782b",
      survey: "#49a7ad",
      bridge: "#ddd3e4",
      text: "#403746"
    };

    // One logo per tool: cluster hubs are R, Plotly, Python, Quarto, and Qualtrics.
    // There are no duplicate "small" copies of hub logos.
    const nodes = [
      // 1. R data science — upper left
      {id:"rhub", label:"R", category:"R data science", x:3.15, y:8.75, image:"r-hub.jpg", hub:true},
      {id:"tidyverse", label:"tidyverse", category:"R data science", x:3.15, y:10.28, image:"tidyverse-exact.png"},
      {id:"dplyr", label:"dplyr", category:"R data science", x:4.68, y:9.48, image:"dplyr-exact.jpg"},
      {id:"ggplot2", label:"ggplot2", category:"R data science", x:4.68, y:7.92, image:"ggplot2-exact.png"},
      {id:"tidymodels", label:"tidymodels", category:"R data science", x:3.15, y:7.20, image:"tidymodels-exact.png"},
      {id:"tidyr", label:"tidyr", category:"R data science", x:1.62, y:7.92, image:"tidyr-exact.png"},
      {id:"caret", label:"caret", category:"R data science", x:1.62, y:9.48, image:"caret-exact.jpg"},

      // 2. Interactive visualization & apps — upper right
      {id:"plotlyhub", label:"Plotly", category:"Interactive visualization & apps", x:13.55, y:8.75, image:"plotly-hub.png", hub:true},
      {id:"rshiny", label:"R Shiny", category:"Interactive visualization & apps", x:12.15, y:10.12, image:"rshiny-exact.png"},
      {id:"observable", label:"Observable JS", category:"Interactive visualization & apps", x:15.10, y:8.75, image:"observable-exact.png"},

      // 3. Python & scientific computing — center
      {id:"pythonhub", label:"Python", category:"Python & scientific computing", x:8.35, y:5.72, image:"python-hub.png", hub:true},
      {id:"pandas", label:"pandas", category:"Python & scientific computing", x:6.63, y:6.85, image:"pandas-exact.png"},
      {id:"numpy", label:"NumPy", category:"Python & scientific computing", x:10.07, y:6.85, image:"numpy-exact.png"},
      {id:"bio", label:"GSEA / bioinformatics", category:"Python & scientific computing", x:8.35, y:4.08, image:"bio-exact.jpg"},

      // 4. Research workflow & communication — lower left
      {id:"quartohub", label:"Quarto", category:"Research workflow & communication", x:3.15, y:2.25, image:"quarto-hub.png", hub:true},
      {id:"github", label:"GitHub", category:"Research workflow & communication", x:3.15, y:3.84, image:"github-exact.png"},
      {id:"latex", label:"LaTeX", category:"Research workflow & communication", x:1.50, y:2.25, image:"latex-exact.jpg"},
      {id:"apps", label:"Google Apps Script", category:"Research workflow & communication", x:4.80, y:2.25, image:"apps-script-exact.png"},

      // 5. Survey & statistical platforms — lower right
      {id:"qualtrics", label:"Qualtrics", category:"Survey & statistical platforms", x:13.15, y:2.25, image:"qualtrics-exact.jpg", hub:true},
      {id:"spss", label:"SPSS", category:"Survey & statistical platforms", x:15.10, y:2.25, image:"spss-exact.jpg"}
    ];

    const byId = Object.fromEntries(nodes.map(n => [n.id, n]));
    const edgeGroups = [
      {color:colors.r, width:4, dash:"solid", pairs:[
        ["rhub","tidyverse"],["rhub","dplyr"],["rhub","ggplot2"],["rhub","tidymodels"],["rhub","tidyr"],["rhub","caret"]
      ]},
      {color:colors.apps, width:4, dash:"solid", pairs:[
        ["plotlyhub","rshiny"],["plotlyhub","observable"]
      ]},
      {color:colors.python, width:4, dash:"solid", pairs:[
        ["pythonhub","pandas"],["pythonhub","numpy"],["pythonhub","bio"]
      ]},
      {color:colors.workflow, width:4, dash:"solid", pairs:[
        ["quartohub","github"],["quartohub","latex"],["quartohub","apps"]
      ]},
      {color:colors.survey, width:4, dash:"solid", pairs:[
        ["qualtrics","spss"]
      ]},
      {color:colors.bridge, width:2, dash:"dot", pairs:[
        ["ggplot2","pandas"],["plotlyhub","numpy"],["pythonhub","quartohub"],["pythonhub","qualtrics"],["apps","qualtrics"]
      ]}
    ];

    const traces = edgeGroups.map(group => {
      const x = [], y = [];
      group.pairs.forEach(([a,b]) => {
        x.push(byId[a].x, byId[b].x, null);
        y.push(byId[a].y, byId[b].y, null);
      });
      return {
        type:"scatter", mode:"lines", x, y,
        line:{color:group.color, width:group.width, dash:group.dash},
        opacity:group.dash === "dot" ? .62 : .82,
        hoverinfo:"skip", showlegend:false
      };
    });

    // Invisible hover targets: all leaf circles are equal; hubs are only slightly larger.
    traces.push({
      type:"scatter",
      mode:"markers",
      x:nodes.map(n => n.x),
      y:nodes.map(n => n.y),
      customdata:nodes.map(n => [n.label,n.category]),
      marker:{
        size:nodes.map(n => n.hub ? 94 : 76),
        color:"rgba(255,255,255,0)",
        line:{color:"rgba(255,255,255,0)",width:0}
      },
      hovertemplate:"<b>%{customdata[0]}</b><br>%{customdata[1]}<extra></extra>",
      showlegend:false
    });

    const images = nodes.map(n => ({
      source:`assets/logos/exact_core/${n.image}`,
      xref:"x", yref:"y", x:n.x, y:n.y,
      sizex:n.hub ? .88 : .70,
      sizey:n.hub ? .88 : .70,
      xanchor:"center", yanchor:"middle",
      sizing:"contain", opacity:1, layer:"above"
    }));

    const shapes = nodes.map(n => {
      const clusterColor = n.category.startsWith("R data") ? colors.r
        : n.category.startsWith("Interactive") ? colors.apps
        : n.category.startsWith("Python") ? colors.python
        : n.category.startsWith("Research") ? colors.workflow
        : colors.survey;
      const radius = n.hub ? .67 : .56;
      return {
        type:"circle", xref:"x", yref:"y",
        x0:n.x-radius, x1:n.x+radius, y0:n.y-radius, y1:n.y+radius,
        fillcolor:"rgba(255,255,255,.98)",
        line:{color:clusterColor,width:n.hub?3:2},
        layer:"below"
      };
    });

    const annotations = [
      {x:3.15,y:11.18,text:"<b>R data science</b>",font:{color:colors.r,size:17}},
      {x:13.55,y:11.18,text:"<b>Interactive visualization & apps</b>",font:{color:colors.apps,size:17}},
      {x:8.35,y:7.88,text:"<b>Python & scientific computing</b>",font:{color:colors.python,size:17}},
      {x:3.15,y:.42,text:"<b>Research workflow & communication</b>",font:{color:colors.workflow,size:17}},
      {x:13.70,y:.42,text:"<b>Survey & statistical platforms</b>",font:{color:colors.survey,size:17}}
    ].map(a => ({...a,xref:"x",yref:"y",showarrow:false,xanchor:"center",yanchor:"middle"}));

    // Only non-hub tools get text underneath. Hubs are identified by the logo itself.
    const displayLabel = {
      tidyverse:"tidyverse",
      dplyr:"dplyr",
      ggplot2:"ggplot2",
      tidymodels:"tidymodels",
      tidyr:"tidyr",
      caret:"caret",
      rshiny:"R Shiny",
      observable:"Observable JS",
      pandas:"pandas",
      numpy:"NumPy",
      bio:"GSEA / bioinformatics",
      github:"GitHub",
      latex:"LaTeX",
      apps:"Google Apps Script",
      spss:"SPSS"
    };

    nodes.filter(n => !n.hub).forEach(n => {
      annotations.push({
        x:n.x,
        y:n.y - .55,
        xref:"x", yref:"y", showarrow:false,
        text:`<b>${displayLabel[n.id] || n.label}</b>`,
        xanchor:"center", yanchor:"top", align:"center",
        font:{family:"Inter, system-ui, sans-serif",size:12,color:colors.text}
      });
    });

    const layout = {
      autosize:true,
      margin:{l:22,r:22,t:12,b:16},
      paper_bgcolor:"rgba(0,0,0,0)",
      plot_bgcolor:"rgba(0,0,0,0)",
      xaxis:{range:[0,16.8],visible:false,fixedrange:false,zeroline:false},
      yaxis:{range:[0,11.65],visible:false,fixedrange:false,zeroline:false,scaleanchor:"x",scaleratio:1},
      images,
      shapes,
      annotations,
      hoverlabel:{
        bgcolor:"white",
        bordercolor:"#d8bfe9",
        font:{family:"Inter, system-ui, sans-serif",color:colors.text}
      },
      dragmode:"pan"
    };

    const config = {
      responsive:true,
      displaylogo:false,
      scrollZoom:true,
      modeBarButtonsToRemove:["select2d","lasso2d","autoScale2d","toggleSpikelines"],
      toImageButtonOptions:{format:"png",filename:"zihan-hei-tools-platforms-network",scale:2}
    };
    Plotly.newPlot(host,traces,layout,config);
  }

  function renderAll(){ drawRadar(); drawToolsNetwork(); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",renderAll); else renderAll();
})();
