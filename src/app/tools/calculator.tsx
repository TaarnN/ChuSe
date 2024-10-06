"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [operation, setOperation] = useState("");
  const [prevValue, setPrevValue] = useState("");

  const handleNumberClick = (num: string) => {
    setDisplay((prev) => (prev === "0" ? num : prev + num));
  };

  const handleOperationClick = (op: string) => {
    setOperation(op);
    setPrevValue(display);
    setDisplay("0");
  };

  const handleEqualsClick = () => {
    const current = parseFloat(display);
    const previous = parseFloat(prevValue);
    let result = 0;

    switch (operation) {
      case "+":
        result = previous + current;
        break;
      case "-":
        result = previous - current;
        break;
      case "*":
        result = previous * current;
        break;
      case "/":
        result = previous / current;
        break;
    }

    setDisplay(result.toString());
    setOperation("");
    setPrevValue("");
  };

  const handleClearClick = () => {
    setDisplay("0");
    setOperation("");
    setPrevValue("");
  };

  return (
    <Card className="mr-[10vw] sm:mr-[30vw] md:mr-[40vw] ml-8">
      <CardHeader>
        <CardTitle className="mb-4">Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2 mr-[30%]">
          <div className="col-span-4 bg-gray-100 p-2 rounded mb-2 text-right text-2xl font-semibold">
            {display}
          </div>
          {[7, 8, 9, "+", 4, 5, 6, "-", 1, 2, 3, "*", "C", 0, "=", "/"].map(
            (item) => (
              <Button
                key={item}
                onClick={() => {
                  if (typeof item === "number")
                    handleNumberClick(item.toString());
                  else if (item === "=") handleEqualsClick();
                  else if (item === "C") handleClearClick();
                  else handleOperationClick(item);
                }}
                variant={typeof item === "number" ? "outline" : "default"}
                className={item === "=" ? "col-span-2" : ""}
              >
                {item}
              </Button>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
