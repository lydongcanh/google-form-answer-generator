import React, { useState } from "react";
import { InputGroup, Button, FormGroup } from "@blueprintjs/core";
import Axios from "axios";

export function Home() {

  const [formUrl, setFormUrl] = useState("https://docs.google.com/forms/u/0/d/e/1FAIpQLSeQ1Srh0b7jOD38nf1YjzlObyw8YwKN5urj-aLCFymaG2YVEQ/formResponse");
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
   
  const search = (
    <div>
      <FormGroup
        label="Number of pages"
        labelFor="number-of-pages-input"
        labelInfo="*"
      >
        <InputGroup
          id="number-of-pages-input"
          disabled={isLoading}
          type="number"
          onChange={(e) => setNumberOfPages(e.target.value)}
          value={numberOfPages}
          min={0}
          max={100}
          step={1}
        />
      </FormGroup>

      <FormGroup
        label="Form url"
        labelFor="form-url-input"
        labelInfo="*"
      >
        <InputGroup
          id="form-url-input"
          disabled={isLoading}
          onChange={(e) => setFormUrl(e.target.value)}
          value={formUrl}
        />
      </FormGroup>

      <Button 
        loading={isLoading}
        color="primary" 
        onClick={getFormData}
      >
        Get Data
      </Button>
    </div>
  );

  return (
    <div>
      {search}
    </div>
  );

  async function getFormData() {
    try {
      setIsLoading(true);
      const response = await Axios.get(`api/googleForms?formUrl=${formUrl}&numberOfPages=${numberOfPages}`);
      const funcString = "function getData() { " + response.data + " return FB_PUBLIC_LOAD_DATA_; } getData()";
      const result = eval(funcString);
  
      const dataList = result[1][1];
      console.log(dataList);
      for (const data of dataList) {
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
    finally {
      setIsLoading(false);
    }
  }

}
