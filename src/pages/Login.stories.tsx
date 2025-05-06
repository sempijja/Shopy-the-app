import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";

export default {
  title: "Pages/Login",
  component: Login,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ padding: "20px" }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof Login>;

const Template: ComponentStory<typeof Login> = (args) => <Login {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Loading = Template.bind({});
Loading.decorators = [
  (Story) => (
    <MemoryRouter>
      <div style={{ padding: "20px" }}>
        <Story />
      </div>
    </MemoryRouter>
  ),
];
Loading.parameters = {
  msw: {
    handlers: [
      rest.post("/auth/signin", (req, res, ctx) => {
        return res(ctx.delay(2000)); // Simulate a loading state
      }),
    ],
  },
};

export const InvalidCredentials = Template.bind({});
InvalidCredentials.decorators = [
  (Story) => (
    <MemoryRouter>
      <div style={{ padding: "20px" }}>
        <Story />
      </div>
    </MemoryRouter>
  ),
];
InvalidCredentials.parameters = {
  msw: {
    handlers: [
      rest.post("/auth/signin", (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({ message: "Invalid credentials. Please try again." })
        );
      }),
    ],
  },
};