// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let sample_num_obj = metadata.filter(x => x.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let id_panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    id_panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (const [key, value] of Object.entries(sample_num_obj)) {
      id_panel.append("h6").text(`${key}: ${value}`);
    }
  });
}

// function to build both charts
function buildCharts(data_sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    console.log(data);

    // Get the samples field
    let samples_field = data.samples;


    // Filter the samples for the object with the desired sample number
    let sample_num_obj = samples_field.filter(x => x.id === data_sample)[0];
    console.log(sample_num_obj);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sample_num_obj.otu_ids;
    let otu_labels = sample_num_obj.otu_labels;
    let sample_values = sample_num_obj.sample_values;

    // Build a Bubble Chart
    let bubble_chart = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: "Viridis"
      },
      text: otu_labels
      };

    let bubble_charts = [bubble_chart];

    // Render the Bubble Chart
    let bubble_format = {
      title: 'Bacteria Cultures per Sample'
    };

    Plotly.newPlot('bubble', bubble_charts, bubble_format);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let bar_y = otu_ids.map(x => `OTU: ${x}`);
    console.log(bar_y);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barchart = {
      x: sample_values.slice(0, 10).reverse(),
      y: bar_y.slice(0, 10).reverse(),
      type: 'bar',
      marker: {
        colorscale: "Viridis",
        color: sample_values.slice(0, 10).reverse()
      },
      text: otu_labels.slice(0, 10).reverse(),
      orientation: 'h'
    };

    // Render the Bar Chart
    let bars = [barchart];
    
    let format = {
      title: "Top 10 Bacteria Cultures Inside Navel of Specified Test Subject"
    };

    Plotly.newPlot("bar", bars, format);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    console.log(data);

    // Get the names field
    let names_field = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < names_field.length; i++){
      let name = names_field[i];
      dropdown.append("option").text(name);
    }

    // Get the first sample from the list
    let first_sample = names_field[0];
    console.log(first_sample);

    // Build charts and metadata panel with the first sample
    buildCharts(first_sample);
    buildMetadata(first_sample);
  });
}

// Function for event listener
function optionChanged(nextChoice) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(nextChoice);
  buildMetadata(nextChoice);
}

// Initialize the dashboard
init();
