package com.alaa.backend.chatroom;

import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

  private final ChatRoomRepository repository;

  public Optional<String> getChatRoomId(
    String senderId,
    String recipientId,
    Boolean createNewRoomIfNotExist
  ){
    return repository.findBySenderIdAndRecipientId(senderId, recipientId)
      .map(ChatRoom::getChatId)
      .or(()-> {
        if(createNewRoomIfNotExist){
          var chatId = createChatId(senderId, recipientId);
          return Optional.of(chatId);
        }
          return Optional.empty();
        
      });
  }

  private String createChatId(String senderId, String recipientId) {
    var chatId = String.format("%s_%s", senderId, recipientId);

    ChatRoom senderRecipient = ChatRoom.builder()
      .chatId(chatId)
      .senderId(senderId)
      .recipientId(recipientId)
      .build();

    ChatRoom recipientSender = ChatRoom.builder()
      .chatId(chatId)
      .senderId(recipientId)
      .recipientId(senderId)
      .build();

    repository.save(senderRecipient);
    repository.save(recipientSender);
    return chatId;
  }
}
