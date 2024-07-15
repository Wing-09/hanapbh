import {
  Body,
  Button,
  Html,
  Img,
  Tailwind,
  Heading,
  Section,
  Text,
  Container,
  Head,
  Hr,
  Link,
} from "@react-email/components";
import * as React from "react";

export default function EmailSignup({
  user_name,
  code,
}: {
  user_name: string;
  code: string;
}) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white">
          <Container className="p-5 border border-gray-200 border-solid rounded shadow-md w-full">
            <Section className="mt-10 ">
              <Img
                src="https://res.cloudinary.com/dowphddjf/image/upload/v1705607251/logo/hanap-bh_iwo1sr.png"
                alt="hanap-bh"
                className=" h-auto aspect-square w-[15vh] my-0 mx-auto"
              />
            </Section>
            <Heading className="text-center text-gray-900">
              <strong className="italic text-4xl">Hanap BH</strong>
            </Heading>
            <Section>
              <Text className="text-3xl font-bold text-gray-900">
                {user_name.charAt(0).toUpperCase() + user_name.slice(1)},
              </Text>
              <Text className="text-base text-gray-900">
                Welcome to <strong className="italic">Hanap BH</strong>! , Use
                the verification code below to proceed your sign up process.
              </Text>
            </Section>
            <Section className="bg-gray-700 rounded my-[10vh] text-center space-x-10 tracking-[2rem]">
              <Text className="font-bold text-white uppercase text-5xl">
                {code}
              </Text>
            </Section>
            <Hr className="w-full h-[1px] bg-gray-200" />
            <Section>
              <Text className="text-xs text-gray-700 text-justify">
                This email is was sent to you from{" "}
                <Link href="https://hanap-bh.vercel.app/">
                  {"(https://hanap-bh.vercel.app/)"}
                </Link>
                . if you did not expect an email from us reset your password and
                further secure your email address here{" "}
                <Link href="https://myaccount.google.com/u/1/security?hl=en">
                  {"(https://myaccount.google.com/u/1/security?hl=en)"}
                </Link>
                . And email us on <strong>hanapbh.dev@gmail.com</strong> so we
                can delete your information in our system.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
