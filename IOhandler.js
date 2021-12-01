/*
 * Project:
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 * 
 * 
 * 
 * 
 * 
 * 
 * Couldn't figure out how to get the gray scale function as a promise.
 */
const { rejects } = require("assert");
const fsc = require("fs");
const { resolve } = require("path");
const unzipper = require("unzipper"),
  fs = require("fs").promises,
  PNG = require("pngjs").PNG,
  path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  fsc.createReadStream(pathIn)
  .pipe(unzipper.Extract({ path: pathOut }));
};

// unzip('../zippedFiles/myfile.zip', '../unzippedFiles')

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */



const readDir = (dir) => {
  fs.readdir(dir)
  .then(directory => directory.filter(file => {
    if (path.extname(file) == '.png') {
      return file
    }
  }))
  .then(newArr => newArr.map(file => {
    let homePath = path.resolve(dir)
    let fullPath = homePath.concat(`\\${file}`)
    return fullPath
  }))
  .catch(err => console.log(err))
};

readDir('./zippedFiles')
/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
    fsc.createReadStream(pathIn)
    .pipe(
      new PNG({
        filterType: 4,
      })
      )
      .on("parsed", function () {
        for (var y = 0; y < this.height; y++) {
          for (var x = 0; x < this.width; x++) {
            var idx = (this.width * y + x) << 2;
            
            // invert color
            const greyColor = (color1, color2, color3) => {
              return (color1+color2+color3)/3
            } 
            // this.data[idx] = 255 - this.data[idx];
            this.data[idx] = greyColor(this.data[idx],this.data[idx + 1],this.data[idx + 2]);
            // this.data[idx + 1] = 255 - this.data[idx + 1];
            this.data[idx + 1] = greyColor(this.data[idx],this.data[idx + 1],this.data[idx + 2]);
            // this.data[idx + 2] = 255 - this.data[idx + 2];
            this.data[idx + 3] = greyColor(this.data[idx],this.data[idx + 1],this.data[idx + 2]);
            
            // and reduce opacity
            this.data[idx + 3] = this.data[idx + 3] >> 1;
          }
        }     
        this.pack().pipe(fsc.createWriteStream(pathOut));
      });
 
  };

grayScale('./unzippedFiles/in.png', './grayscaled/out.png')

module.exports = {
  unzip,
  readDir,
  grayScale,
};
