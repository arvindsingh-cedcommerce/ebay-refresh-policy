import { Button, Card, Popover, Stack } from "@shopify/polaris";
import React, { useEffect, useState } from "react";

const PopoverProduct = (props) => {
  const [popoverActive, setPopoverActive] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setPopoverActive(false);
    });
    // hitGetNotifications();
    return window.removeEventListener("scroll", () => {});
  }, []);

  const activator = (
    <Button
      plain
      disclosure="down"
      onClick={() => {
        setPopoverActive(!popoverActive);
      }}
    >
      View
    </Button>
  );
  // const [y, setY] = useState(window.scrollY);
  // const handleNavigation = (e) => {
  //   const window = e.currentTarget;
  //   if (y > window.scrollY) {
  //     // console.log("scrolling up");
  //   } else if (y < window.scrollY) {
  //     // console.log("scrolling down");
  //   }
  //   setY(window.scrollY);
  //   setPopoverActive(false);
  // };
  // useEffect(() => {
  //   window.addEventListener("scroll", (e) => handleNavigation(e));
  //   return () => {
  //     // return a cleanup function to unregister our function since its gonna run multiple times
  //     window.removeEventListener("scroll", (e) => handleNavigation(e));
  //   };
  // }, [y]);

  return (
    <>
      {props.children.length > 0 && (
        <Popover
          active={popoverActive}
          activator={activator}
          autofocusTarget="first-node"
          onClose={() => setPopoverActive(false)}
        >
          <Popover.Pane>
            <Card sectioned>
              {/* <Stack vertical> */}
                {props.children.map((status) => (
                  <React.Fragment key={status.image}>{status}</React.Fragment>
                ))}
              {/* </Stack> */}
            </Card>
          </Popover.Pane>
        </Popover>
      )}
    </>
  );
};

export default PopoverProduct;
