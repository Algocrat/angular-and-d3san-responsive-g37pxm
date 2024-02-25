


var MyData2 = {
  nodes: [
    { node: 0, name: "Atlanta", color: "#a8385d", 'nodeType': 'city' },
    { node: 1, name: "Dallas", color: "#7aa3e5", 'nodeType': 'city' },
    { node: 2, name: "Tulsa", color: "#a27ea8", 'nodeType': 'city'},
    { node: 3, name: "Austin", color: "#aae3f5", 'nodeType': 'city' },
    { node: 4, name: "Houston", color: "#adcded" , 'nodeType': 'city'},

    { node: 5, name: "Emergency", color: "purple", 'nodeType': 'severity' },
   { node: 6, name: "Alert", color: "red", 'nodeType': 'severity' },
    { node: 7, name: "Critical", color: "orange", 'nodeType': 'severity' },
    
     { node: 8, name: "Warning", color: "yellow", 'nodeType': 'severity' },
    { node: 9, name: "Notice", color: "green", 'nodeType': 'severity' },

 
    { node: 10, name: "Closed", color: "green", 'nodeType': 'status' }

  ],
  links: [

    { source: 0, target: 9, value: 8, link: "severity" },
    { source: 0, target: 8, value: 5, link: "severity" },
    { source: 0, target: 7, value: 3, link: "severity" },
    { source: 0, target: 6, value: 1, link: "severity" },

    { source: 1, target: 9, value: 8, link: "severity" },
    { source: 1, target: 8, value: 5, link: "severity" },
    { source: 1, target: 7, value: 1, link: "severity" },
    { source: 1, target: 6, value: 1, link: "severity" },

    { source: 2, target: 9, value: 8, link: "severity" },
    { source: 2, target: 8, value: 3, link: "severity" },
    
     

    { source: 3, target: 9, value: 8, link: "severity" },
    { source: 3, target: 8, value: 3, link: "severity" },
    { source: 3, target: 7, value: 1, link: "severity" },
    
    { source: 4, target: 9, value: 8, link: "severity" },
    { source: 4, target: 8, value: 4, link: "severity" },
     
    { source: 4, target: 6, value: 1, link: "severity" },
    { source: 4, target: 5, value: 1, link: "severity" },

   
    { source: 9, target: 10, value: 40 , link: "status"},

   
    
    { source: 8, target: 10, value: 20 , link: "status" },

    
    { source: 7, target: 10, value: 5  , link: "status"},
 

    { source: 6, target: 10, value: 3  , link: "status"},

    { source: 5, target: 10, value: 1  , link: "status"}

    

  ]
}

export default MyData2;