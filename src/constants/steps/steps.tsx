import Image from "next/image";
import { Placement } from "react-joyride";

export const steps = [
  {
    title: <strong>Welcome to Trustless Work!</strong>,
    content: (
      <>
        <div
          style={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            marginBottom: "3rem",
          }}
        >
          <Image
            src="/logo.png"
            alt="Trustless Work Logo"
            width={100}
            height={100}
            style={{ marginBottom: "10px" }}
          />
        </div>
        <h2>Here you can understand how to use our API!</h2>
      </>
    ),
    placement: "center",
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
        depending on your role. See more details about a specific escrow by
        clicking on it. There you'll be able to see the status, parties
        involved, the current balance and also do some actions like Fund,
        Release, etc.
      </h2>
    ),
    placement: "auto" as Placement,
    target: "#step-3",
  },
];
