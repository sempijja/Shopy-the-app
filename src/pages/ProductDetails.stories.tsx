import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProductDetails from "./ProductDetails";
import "../index.css"; // Import global styles

export default {
  title: "Pages/ProductDetails",
  component: ProductDetails,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/product-details/1"]}>
        <Routes>
          <Route path="/product-details/:productId" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof ProductDetails>;

const Template: ComponentStory<typeof ProductDetails> = (args) => <ProductDetails {...args} />;

export const Default = Template.bind({});
Default.args = {};