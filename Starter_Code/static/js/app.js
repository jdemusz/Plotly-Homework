function buildMetadata(sample) {

    // @TODO: Complete the following function that builds the metadata panel
    // Use `d3.json` to fetch the metadata for a sample
    var metadataURL = "/metadata/" + sample;
    // Use d3 to select the panel with id of `#sample-metadata`
    var panelMetadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panelMetadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    d3.json(metadataURL).then(function (data) {
      Object.entries(data).forEach(([key, value]) => {
        panelMetadata.append("h6").text(`${key}: ${value}`
        );
      })