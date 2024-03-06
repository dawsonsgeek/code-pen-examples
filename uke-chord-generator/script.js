const { useState, useEffect, Fragment } = React;

const assetsUrl = "http://ukulala.surge.sh/chords";
/**
 * Storage theme settings
 *
 * set Storage.val = {color: 'blue'}
 * get Storage.val
 */
const Storage = {
  get val() {
    this.data = window.localStorage.getItem("demo_data");
    return JSON.parse(this.data);
  },
  set val(value) {
    this.data = JSON.stringify(value);
    window.localStorage.setItem("demo_data", this.data);
  } };


// check array duplicates
const hasDuplicates = array => {
  return new Set(array).size !== array.length;
};


/* Notes
-----------------------------*/
const Notes = {
  C: "C",
  Db: "Db",
  D: "D",
  Eb: "Eb",
  E: "E",
  F: "F",
  Gb: "Gb",
  G: "G",
  Ab: "Ab",
  A: "A",
  Bb: "Bb",
  B: "B" };

/* Tonalityes
-----------------------------*/
const Tonalityes = {
  "": "",
  m: "m",
  _: "+",
  "5": "5",
  "6": "6",
  maj7: "maj7",
  m7: "m7",
  m6: "m6",
  m7_b5_: "m7(b5)",
  dim7: "dim7",
  "7": "7",
  "9": "9",
  "7_b9_": "7(b9)",
  "7__5_": "7(#5)" };

/* Simple forms component
-----------------------------*/
const Form = props => /*#__PURE__*/React.createElement("form", { onSubmit: props.fn }, props.children);
const Select = props => {
  let data = props.data;
  let notes = {};
  if (props.sort) notes = Object.entries(data).sort();else
  notes = Object.entries(data);
  return /*#__PURE__*/(
    React.createElement("select", { onChange: props.fn },
    notes.map(([key, value]) => /*#__PURE__*/
    React.createElement("option", { key: key, value: key },
    value))));




};
const Submit = props => /*#__PURE__*/React.createElement("input", { type: "submit", value: props.val || "Get" });

/* Columns
-----------------------------*/
const Boxes = props => /*#__PURE__*/React.createElement("div", { className: "boxes" }, props.children);
const Box = props => /*#__PURE__*/React.createElement("div", { className: "box" }, props.children);
const ImgLoader = () => /*#__PURE__*/React.createElement("div", { className: "img-loading" }, /*#__PURE__*/React.createElement("div", null));

/* Image
-----------------------------*/
const Image = props => {
  const [src, setSrc] = useState("");
  // use timeout and show image
  useEffect(() => {
    let timerid = false;
    if (timerid) {
      clearTimeout(timerid);
    }
    timerid = setTimeout(() => {
      setSrc(`${assetsUrl}/${props.data}.svg`);
    }, 100);
  }, [props.data]);

  return /*#__PURE__*/(
    React.createElement("figure", { className: `thumb ${props.data}` }, /*#__PURE__*/
    React.createElement("span", { className: "img-close", onClick: props.fn }, "\xD7"),

    src ? /*#__PURE__*/React.createElement("img", { src: src }) : /*#__PURE__*/React.createElement(ImgLoader, null), /*#__PURE__*/
    React.createElement("figcaption", null,
    props.data.substring(0, 2).charAt(1) === "b" ?
    Notes[props.data.substring(0, 2)] +
    " " +
    Tonalityes[props.data.substring(2, props.data.length)] :
    Notes[props.data.substring(0, 1)] +
    " " +
    Tonalityes[props.data.substring(1, props.data.length)])));



};

const Header = (props) => /*#__PURE__*/
React.createElement("header", { className: "header" }, /*#__PURE__*/
React.createElement("h3", null, props.children));



const App = () => {
  // last array
  let lastSaved = Storage.val ? Storage.val : ["C"];
  // data of chords
  const [data, setData] = useState(["C"]);

  // note & tonality
  const [note, setNote] = useState("C");
  const [tonality, setTonality] = useState("");

  // on init get last data saved
  useEffect(() => setData(lastSaved), []);

  // Add submit
  const handleSubmit = e => {
    e.preventDefault();
    let arr = note + tonality;
    let newArr = [...data, arr];
    if (hasDuplicates(newArr)) {
      // if chord exists show red color
      let img = document.querySelector(`.${arr}`);
      img.classList.add("exists");
      let w = setTimeout(() => {
        img.classList.remove("exists");
        clearTimeout(w);
      }, 800);
    }
    // update array of unique elements
    setData([...new Set(newArr)]);
    Storage.val = [...new Set(newArr)];
    return false;
  };

  // delete data
  const removeData = (evt, index) => {
    let element = evt.target.parentNode;
    element.classList.add("hide");

    let w = setTimeout(() => {
      // remove array by index
      let arr = [...data];
      arr.splice(index, 1);
      // remove duplicates
      let savedArr = [...new Set(arr)];
      // update
      setData(savedArr);
      // storage saved
      Storage.val = savedArr;
      clearTimeout(w);
    }, 500);

  };

  return /*#__PURE__*/(
    React.createElement(Fragment, null, /*#__PURE__*/
    React.createElement(Header, null, "Uke Chord Generator"), /*#__PURE__*/
    React.createElement(Form, { fn: handleSubmit }, /*#__PURE__*/
    React.createElement(Select, {
      sort: false,
      fn: e => setNote(e.target.value),
      data: Notes }), /*#__PURE__*/
    React.createElement(Select, {
      sort: true,
      fn: e => setTonality(e.target.value),
      data: Tonalityes }), /*#__PURE__*/

    React.createElement(Submit, { val: "+" })), /*#__PURE__*/

    React.createElement(Boxes, null,
    data.map((item, index) => /*#__PURE__*/
    React.createElement(Box, { key: index }, /*#__PURE__*/
    React.createElement(Image, {
      fn: evt => removeData(evt, index),
      data: item }))))));





};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), window.root);