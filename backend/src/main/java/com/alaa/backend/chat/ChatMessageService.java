package com.alaa.backend.chat;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.alaa.backend.chatroom.ChatRoomService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatMessageService {

  private final ChatMessageRepository chatMessageRepository;
  private final ChatRoomService chatRoomService;

  public ChatMessage save(ChatMessage chatMessage) {
    var chatRoom = chatRoomService.getChatRoomId(
      chatMessage.getSenderId(),
      chatMessage.getRecipientId(),
      true
      ).orElseThrow();
    chatMessage.setChatId(chatRoom);
    chatMessageRepository.save(chatMessage);
    return chatMessage;
  }

  public List<ChatMessage> findChatMessages(String senderId, String recipientId) {
    var chatId = chatRoomService.getChatRoomId(senderId, recipientId, false);

    return chatId.map(chatMessageRepository::findByChatId).orElse(new ArrayList<>());

  }
}
