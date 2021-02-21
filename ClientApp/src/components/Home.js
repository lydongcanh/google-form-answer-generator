import React, { useState } from "react";
import { InputGroup, InputGroupAddon, Button, Input } from "reactstrap";
import Axios from "axios";

export default function Home() {

  const [formUrl, setFormUrl] = useState("https://docs.google.com/forms/u/0/d/e/1FAIpQLSeQ1Srh0b7jOD38nf1YjzlObyw8YwKN5urj-aLCFymaG2YVEQ/formResponse");
  const [numberOfPages, setNumberOfPages] = useState(1);

  async function getFormData() {
    const response = await Axios.get(`api/googleForms?formUrl=${formUrl}&numberOfPages=${numberOfPages}`);
    const funcString = "function getData() { " + response.data + " return FB_PUBLIC_LOAD_DATA_; } getData()";
    const result = eval(funcString);
    
    const dataList = result[1][1];
    console.log(dataList);
    for(const data of dataList) {
      const lastItem = data[data.length - 1];
      if (Array.isArray(lastItem)) {
        console.log("Question", {
          "question": data[1],
          "answers": lastItem[0][1],
          "entry.id": lastItem[0][0],
        });
        continue;
      }

      console.log("Session", data[1]);
    }
  }

  return (
    <InputGroup>
      <InputGroupAddon addonType="prepend">
        <Input
          placeholder="Number of pages"
          type="number"
          onChange={(e) => setNumberOfPages(e.target.value)}
          value={numberOfPages}
          min={0}
          max={100}
          step={1}
        />
      </InputGroupAddon>
      <Input
        placeholder="Form url..."
        onChange={(e) => setFormUrl(e.target.value)}
        value={formUrl}
      />
      <InputGroupAddon addonType="append">
        <Button color="secondary" onClick={getFormData}>Get Data</Button>
      </InputGroupAddon>
    </InputGroup>
  );
}
