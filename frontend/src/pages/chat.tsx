import React, { useEffect, useState } from "react";
import ChatDisplay from "../components/ChatDisplay";
import ChatComp from "../components/ChatComp";
import { faker } from "@faker-js/faker";
import ChatModel from "../modules/chat";

function Chat() {

  return (
    <div>
      <ChatComp />
    </div>
  );
}

export default Chat;
