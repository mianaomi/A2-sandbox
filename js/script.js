const margin = { top: 80, right: 60, bottom: 60, left: 100 };
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;
// The margin code above
let allData = []

let settingVariable = 'ABANDONED BUILDING', distinctionVariable = 'Crime Type';
function init(){
  d3.csv("./data/crimes2024.csv", 
    function(d){
    return {  
    // Besides converting the types, we also simpilify the variable names here. 
    ID: d.ID,
    locationDesc: d.Location_Description,
    district: d.District
    
    }})
  .then(data => {
          console.log(data)
          allData = data
          setupSelector()
          
        
      })
  .catch(error => console.error('Error loading data:', error));
}

window.addEventListener('load', init);
const settingOptions = ['ABANDONED BUILDING', 'AIRCRAFT', 'AIRPORT BUILDING NON-TERMINAL - NON-SECURE AREA','AIRPORT BUILDING NON-TERMINAL - SECURE AREA',
'AIRPORT EXTERIOR - NON-SECURE AREA', 'AIRPORT EXTERIOR - SECURE AREA', 'AIRPORT PARKING LOT', 'AIRPORT TERMINAL LOWER LEVEL - NON-SECURE AREA',
'AIRPORT TERMINAL LOWER LEVEL - SECURE AREA', 'AIRPORT TERMINAL MEZZANINE - NON-SECURE AREA', 'AIRPORT TERMINAL UPPER LEVEL - NON-SECURE AREA',
'AIRPORT TERMINAL UPPER LEVEL - SECURE AREA', 'AIRPORT TRANSPORTATION SYSTEM (ATS)','AIRPORT VENDING ESTABLISHMENT', 'ALLEY', 'ANIMAL HOSPITAL',
'APARTMENT', 'APPLIANCE STORE', 'ATHLETIC CLUB', 'ATM (AUTOMATIC TELLER MACHINE)', 'AUTO','AUTO / BOAT / RV DEALERSHIP', 'BANK','BARBERSHOP',
'BARBER SHOP/BEAUTY SALON','BAR OR TAVERN','BASEMENT','BOAT / WATERCRAFT','BOWLING ALLEY','BRIDGE','CAR WASH','CASINO/GAMBLING ESTABLISHMENT','CEMETARY',
'CHA APARTMENT','CHA GROUNDS','CHA HALLWAY','CHA HALLWAY / STAIRWELL / ELEVATOR','CHA PARKING LOT / GROUNDS','CHURCH / SYNAGOGUE / PLACE OF WORSHIP',
'CLEANING STORE','COIN OPERATED MACHINE','COLLEGE / UNIVERSITY - GROUNDS','COLLEGE / UNIVERSITY - RESIDENCE HALL','COMMERCIAL / BUSINESS OFFICE',
'CONSTRUCTION SITE','CONVENIENCE STORE','CREDIT UNION','CTA BUS','CTA BUS STOP','CTA "L" TRAIN','CTA PARKING LOT / GARAGE / OTHER PROPERTY','CTA PLATFORM',
'CTA PROPERTY','CTA STATION','CTA TRACKS - RIGHT OF WAY','CTA TRAIN','CURRENCY EXCHANGE','DAY CARE CENTER','DEPARTMENT STORE','DRIVEWAY',
'DRIVEWAY - RESIDENTIAL','DRUG STORE','FACTORY / MANUFACTURING BUILDING','FARM','FEDERAL BUILDING','FIRE STATION','FOREST PRESERVE','GANGWAY','GARAGE','GAS STATION',
'GOVERNMENT BUILDING / PROPERTY','GROCERY FOOD STORE','HALLWAY','HIGHWAY / EXPRESSWAY','HOSPITAL','HOSPITAL BUILDING / GROUNDS','HOTEL / MOTEL',
'HOUSE','JAIL / LOCK-UP FACILITY','KENNEL','LAKEFRONT / WATERFRONT / RIVERBANK','LIBRARY','LIQUOR STORE','MEDICAL / DENTAL OFFICE','MOVIE HOUSE / THEATER',
'NEWSSTAND','NURSING / RETIREMENT HOME','OFFICE','OTHER COMMERCIAL TRANSPORTATION','OTHER RAILROAD PROPERTY / TRAIN DEPOT','OTHER (SPECIFY)',
'PARKING LOT','PARKING LOT / GARAGE (NON RESIDENTIAL)','PARK PROPERTY','PAWN SHOP','POLICE FACILITY / VEHICLE PARKING LOT','POOL ROOM','PORCH','RAILROAD PROPERTY',
'RESIDENCE', '']
const distTypeOptions = ['Crimes in District', 'Crimes in Setting']
function setupSelector(){
  // Handles UI changes (sliders, dropdowns)
  // Anytime the user tweaks something, this function reacts.
  // May need to call updateAxes() and updateVis() here when needed!
  
    d3.select('#settingVariable').property('value', settingVariable)
    d3.select('#distinctionVariable').property('value', distinctionVariable)
    d3.select('#settingVariable')
      .selectAll('option') // Select all option elements inside the dropdown
      .data(settingOptions) // Bind data array
      .enter()
      .append('option') // Create <option> elements
      .text(d => d) // Set visible text
      .attr("value", d => d) // Set value attribute
      .on("change", function (event) {
        settingVariable = d3.select('#settingVariable').property('value');
        distinctionVariable = d3.select('#distinctionVariable').property('value');
        updateVis();
          });
    d3.select('#distinctionVariable')
      .selectAll('option') // Select all option elements inside the dropdown
      .data(distTypeOptions) // Bind data array
      .enter()
      .append('option') // Create <option> elements
      .text(d => d) // Set visible text
      .attr("value", d => d) // Set value attribute
      .on("change", function (event) {
          settingVariable = d3.select('#settingVariable').property('value');
          distinctionVariable = d3.select('#distinctionVariable').property('value');
          updateVis();
        
      });


}
function updateVis(){}
// Create SVG
const svg = d3.select('#vis')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);




 