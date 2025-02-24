import { Placement } from "react-joyride";

export const steps = [
  {
    title: <strong>Welcome to Trustless Work!</strong>,
    content: <h2>Here you can understand how to use our API!</h2>,
    placement: "center" as Placement,
    target: "body",
  },
  {
    title: <strong>Roles in Trustless Work</strong>,
    content: <h2>Here you'll find all the roles in each Escrow.</h2>,
    placement: "auto" as Placement,
    target: "#step-1",
  },
  {
    title: <strong>Initialize an Escrow</strong>,
    content: (
      <h2>
        Start by setting up a new escrow agreement. This includes specifying the
        terms, amounts, and parties involved.
      </h2>
    ),
    placement: "auto" as Placement,
    target: "#step-2",
  },
  {
    title: <strong>Your Escrows</strong>,
    content: (
      <h2>
        Here you can see all the escrows you've created or are involved in
        depending on your role.
      </h2>
    ),
    placement: "auto" as Placement,
    target: "#step-3",
  },
];
