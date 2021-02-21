import React, { useState } from "react";
import { InputGroup, Button, Card, FormGroup, Tag, Label } from "@blueprintjs/core";
import Axios from "axios";

export function Home() {

  const [formUrl, setFormUrl] = useState("https://docs.google.com/forms/u/0/d/e/1FAIpQLSeQ1Srh0b7jOD38nf1YjzlObyw8YwKN5urj-aLCFymaG2YVEQ/formResponse");
  const [numberOfPages, setNumberOfPages] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState([]);

  const search = (
    <Card>
      <FormGroup
        label="Number of pages"
        helperText="Only include page that has questions"
        labelFor="number-of-pages-input"
        labelInfo="*"
      >
        <InputGroup
          id="number-of-pages-input"
          disabled={isLoading}
          type="number"
          onChange={(e) => setNumberOfPages(e.target.value)}
          value={numberOfPages}
          min={1}
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
    </Card>
  );

  const form = () => {
    if (!formData || formData.length < 1)
      return;

    const result = [];
    for(const data of formData) {
      if (data.type === "question") {
        const children = [];
        if (data.answers && data.answers.length > 0) {
          //console.log(data.question, data.answers);
          for(const answer of data.answers) {
            children.push(
              <InputGroup
                readOnly
                key={`input-group${data.entryId}-${answer}`}
                value={Array.isArray(answer) ? answer[0] : answer}
              />
            );
          }
        } else {
          children.push(<InputGroup key={`input-group${data.entryId}`} />);
        }

        result.push((
          <Label key={`label-${data.entryId}`}>
            {data.question}
            {children}
          </Label>
        ));
      } else {
        result.push(
          <Tag 
            fill  
            style={{ marginBottom: 8 }}
            key={`tag-${data.name}`}
          >
            {data.name}
          </Tag>
        );
      }
    }
    return (
      <Card style={{ marginTop: 16 }}>{result}</Card>
    );
  };

  return (
    <div>
      {search}
      {form()}
    </div>
  );

  async function getFormData() {
    try {
      setIsLoading(true);
      const response = await Axios.get(`api/googleForms?formUrl=${formUrl}&numberOfPages=${numberOfPages}`);
      const funcString = "function getData() { " + response.data + " return FB_PUBLIC_LOAD_DATA_; } getData()";
      const result = eval(funcString);
  
      const dataList = result[1][1];
      const newFormData = [];
      for (const data of dataList) {
        const lastItem = data[data.length - 1];
        if (Array.isArray(lastItem)) {
          newFormData.push({
            type: "question",
            question: data[1],
            answers: lastItem[0][1],
            entryId: lastItem[0][0],
          });
          // console.log("Question", {
          //   "question": data[1],
          //   "answers": lastItem[0][1],
          //   "entry.id": lastItem[0][0],
          // });
          continue;
        }
  
        newFormData.push({
          type: "session",
          name: data[1]
        });
        //console.log("Session", data[1]);
      }

      setFormData(newFormData);
    } catch(e) {
      console.error(e);
    }
    finally {
      setIsLoading(false);
    }
  }

}
