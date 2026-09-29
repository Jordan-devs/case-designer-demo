import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import Link from "next/dist/client/link";

const NewOrderNotificationEmail = ({
  orderId,
  orderDate,
  customerEmail,
  customerName,
}: {
  orderId: string;
  orderDate: string;
  customerEmail: string;
  customerName: string;
}) => {
  return (
    <Html>
      <Head />
      <Preview>{`New order received — ${orderId}`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={message}>
            <Heading style={heading}>You've got a new order! 🎉</Heading>
            <Text style={text}>
              {customerName} just placed an order. Time to get it made and
              shipped.
            </Text>
          </Section>
          <Hr style={hr} />
          <Section style={defaultPadding}>
            <Text style={paragraphWithBold}>Order Number</Text>
            <Text style={value}>{orderId}</Text>

            <Text style={{ ...paragraphWithBold, marginTop: 16 }}>
              Order Date
            </Text>
            <Text style={value}>{orderDate}</Text>

            <Text style={{ ...paragraphWithBold, marginTop: 16 }}>
              Customer
            </Text>
            <Text style={value}>
              {customerName} ({customerEmail})
            </Text>
          </Section>
          <Hr style={hr} />
          <Section style={defaultPadding}>
            <Text style={{ ...text, fontSize: 13 }}>
              View full order details and the shipping address in your{" "}
              <Link
                href={`${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard`}
                style={{ color: "#000", textDecoration: "underline" }}
              >
                dashboard
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default NewOrderNotificationEmail;

const paddingX = { paddingLeft: "40px", paddingRight: "40px" };
const paddingY = { paddingTop: "22px", paddingBottom: "22px" };
const defaultPadding = { ...paddingX, ...paddingY };

const paragraph = { margin: "0", lineHeight: "2" };
const paragraphWithBold = { ...paragraph, fontWeight: "bold" };

const text = { ...paragraph, color: "#747474", fontWeight: 500 };
const value = { margin: "4px 0 0 0", fontWeight: 500, color: "#000" };

const heading = {
  fontSize: "26px",
  lineHeight: "1.3",
  fontWeight: 700,
  textAlign: "center",
  letterSpacing: "-1px",
} as React.CSSProperties;

const hr = { borderColor: "#E5E5E5", margin: "0" };

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "10px auto",
  width: "600px",
  maxWidth: "100%",
  border: "1px solid #E5E5E5",
};

const message = {
  padding: "40px 74px",
  textAlign: "center",
} as React.CSSProperties;
