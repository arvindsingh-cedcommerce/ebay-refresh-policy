import { Thumbnail } from "@shopify/polaris";
import React from "react";
import NoDataFound from "../../../assets/notfound.png";

const CustomisedGrid = ({ headings, rows, collapsibleOpen }) => {
//   console.log("rows", rows);
  return (
    <div>
      <table>
        <tr>
          {headings.map((heading) => (
            <th>{heading["title"]}</th>
          ))}
        </tr>
        {rows.map((row) => {
          return (
              <tr>
            <tr>
              {Object.keys(row).map((e) => {
                if (e === "image") {
                  if (!row[e]) {
                    row[e] = NoDataFound;
                  } else {
                    let setExtension = ["jpg", "jpeg", "png", "gif"].filter(
                      (extension) => row[e].includes(extension)
                    );
                    row[e] = row[e].replace(
                      `.${setExtension}`,
                      `_small.${setExtension}`
                    );
                  }
                  return (
                    <td>
                      <Thumbnail source={row[e]} size="small" />
                    </td>
                  );
                } else if (e === "variantData") {
                  console.log(e, row[e]);
                //   return <td>12</td>;
                } else if (e !== "variantData") return <td>{row[e]}</td>;
              })}
            </tr>
            
            {/* {e === 'collapsibleIcon' && <tr>{row[e] ? 'collapsibleOpen' : 'not open'}</tr>} */}
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default CustomisedGrid;
