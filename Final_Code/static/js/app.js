function init() {

  // we get a reference to the dropdown
  var selector = d3.select('#selDataset');

  // we use data.names to populate the select option
  d3.json('samples.json').then((data) => {
      var sampleNames = data.names;

      sampleNames.forEach((sample) => {
          selector.append('option')
              .text(sample)
              .property('value', sample);
      });

      // build metadata section
      var sample = sampleNames[0];
      buildMetadata(sample);
      buildCharts(sample);
  });

}

function buildMetadata(sample) {
  d3.json('samples.json').then((data) => {
      var metadata = data.metadata;
      // filter metadata using our sample id
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      
      var metadataPanel = d3.select('#sample-metadata');
      // let's clear the panel from any existing metadata
      metadataPanel.html('');
      Object.entries(result).forEach(([key, value]) => {
          metadataPanel.append('h6').text(`${key.toUpperCase()}: ${value}`);
      });

      // Build the Gauge Chart using wfreq (weekly washing frequency)
      buildGauge(result.wfreq);
  });
}

function buildCharts(sample){
  d3.json('samples.json').then((data) => {
      var samples = data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];

      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;
      
      // 1. bubble chart, https://plot.ly/javascript/bubble-charts/
      var bubbleLayout = {
          title: 'Bacteria Cultures Per Sample',
          // margin: { t: 0},
          hovermode: 'closest',
          xaxis: {
              title: 'OTU ID'
          },
          // margin: { t: 30}
      };
      var bubbleData = [
          {
              x: otu_ids,
              y: sample_values,
              text: otu_labels,
              mode: 'markers',
              marker: {
                  size: sample_values,
                  color: otu_ids,
                  colorscale: 'Earth'
              }
          }
      ];

      Plotly.newPlot('bubble', bubbleData, bubbleLayout);

      // 2. bar chart, https://plot.ly/javascript/bar-charts/
      var yticks = otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse();

      var barData = [
          {
              x: sample_values.slice(0, 10).reverse(),
              y: yticks,
              text: otu_labels.slice(0, 10).reverse(),
              type: 'bar',
              orientation: 'h',
          }
      ];

      var barLayout = {
          title: 'Top 10 Bacteria Cultures Found'
      };

      Plotly.newPlot('bar', barData, barLayout);
  })
}

function optionChanged(sample){
  buildMetadata(sample);
  buildCharts(sample);
}

// initialize the dashboard
init();