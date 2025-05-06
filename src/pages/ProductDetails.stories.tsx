import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProductDetails from "./ProductDetails";

// Mock Supabase client
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          id: "1",
          name: "Sample Product",
          price: 100.0,
          quantity: 10,
          description: "This is a sample product.",
          images: ["https://via.placeholder.com/150"],
          download_link: null,
        },
        error: null,
      }),
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn().mockResolvedValue({ data: { path: "sample-path" }, error: null }),
        getPublicUrl: jest.fn(() => ({
          data: { publicUrl: "https://via.placeholder.com/150" },
        })),
      })),
    },
  },
}));

export default {
  title: "Pages/ProductDetails",
  component: ProductDetails,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/products/1"]}>
        <Routes>
          <Route path="/products/:productId" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof ProductDetails>;

const Template: ComponentStory<typeof ProductDetails> = (args) => <ProductDetails {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Loading = Template.bind({});
Loading.decorators = [
  (Story) => (
    <MemoryRouter initialEntries={["/products/1"]}>
      <Routes>
        <Route
          path="/products/:productId"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          }
        />
      </Routes>
    </MemoryRouter>
  ),
];

export const WithProductDetails = Template.bind({});
WithProductDetails.args = {
  productId: "1",
};