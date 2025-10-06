package com.alaa.backend.chat;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ChatController {
  private final SimpMessagingTemplate messagingTemplate;
  private final ChatMessageService chatMessageService;

  @MessageMapping("/chat")
  public void processMessage(@Payload ChatMessage chatMessage){
    ChatMessage savedMessage = chatMessageService.save(chatMessage);
    messagingTemplate.convertAndSendToUser(
      chatMessage.getRecipientId(),
      "/queue/messages",
      ChatNotification.builder()
        .id(savedMessage.getId())
        .senderId(savedMessage.getSenderId())
        .recipientId(savedMessage.getRecipientId())
        .content(savedMessage.getContent())
        .build()
      );
  }

  @GetMapping("/messages/{senderId}/{recipientId}")
  public ResponseEntity<List<ChatMessage>> findChatMessages(
    @PathVariable("senderId") String senderId,
    @PathVariable("recipientId") String recipientId
    ) {
    var messages = chatMessageService.findChatMessages(senderId, recipientId);
    return ResponseEntity.ok(messages);
  }
}
