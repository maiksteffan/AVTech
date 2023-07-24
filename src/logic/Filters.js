// Object that contains all custom the filters that can be applied to videos

const Filters = {
  /**
   * Filter that applies a color invert effect to the video
   * @param {*} context the context of the canvas
   * @param {*} canvas the canvas element that the modified video is drawn on
   */
  colorInvertFilter: (context, canvas) => {
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    // Loop through the pixels and invert their respective colors
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }

    // Draw the modified result on the canvas
    context.putImageData(imageData, 0, 0);
  },

  /**
   * Filter that applies a grayscale effect to the video (black and white filter)
   * @param {*} context the context of the canvas
   * @param {*} canvas the canvas element that the modified video is drawn on
   */
  grayscaleFilter: (context, canvas) => {
    // Get the image data from the canvas
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    // Loop through the pixels and apply grayscale, by setting the red, green and blue values to the average of the three
    for (let i = 0; i < data.length; i += 4) {
      let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg;
      data[i + 1] = avg;
      data[i + 2] = avg;
    }

    // Draw the modified result on the canvas
    context.putImageData(imageData, 0, 0);
  },

  /**
   * Filter that applies a sepia effect to the video (brownish retro style filter)
   * @param {*} context the context of the canvas
   * @param {*} canvas the canvas element that the modified video is drawn on
   */
  sepiaFilter: (context, canvas) => {
    // Gett the image data from the canvas
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    // Loop through the pixels and get the rgb values
    for (let i = 0; i < data.length; i += 4) {
      let red = data[i];
      let green = data[i + 1];
      let blue = data[i + 2];

      // Apply sepia transformation by setting the red, green and blue values to the new values
      //calculation of the new red value
      data[i] = red * 0.393 + green * 0.769 + blue * 0.189;

      // calculation of the new green value
      data[i + 1] = red * 0.349 + green * 0.686 + blue * 0.168;

      //calculation of the new blue value
      data[i + 2] = red * 0.272 + green * 0.534 + blue * 0.131;
    }

    // Draw the modified result on the canvas
    context.putImageData(imageData, 0, 0);
  },

  /**
   * Filter that making the video appear in the theme of the new barbie movie
   * @param {*} context the context of the canvas
   * @param {*} canvas the canvas element
   */
  barbieFilter: (context, canvas) => {
    // Get the image data from the canvas
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    // Loop through the pixels and apply grayscale, by setting the red, green and blue values to the average of the three
    for (let i = 0; i < data.length; i += 4) {

    //calculate the average of the rgb values for each pixel
      let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;

      //set the rgb values to the average for applying the grayscale filter
      data[i] = avg;
      data[i + 1] = avg;
      data[i + 2] = avg;

      //"pinkify" the greyscaled image by adding 90 to the red value and 40 to the blue value
      data[i] += 90;
      data[i + 2] += 40;
    }

    // Draw the modified result on the canvas
    context.putImageData(imageData, 0, 0);
  },
};
export default Filters;
