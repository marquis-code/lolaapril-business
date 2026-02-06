import { ref } from "vue";
import { chat_api } from "@/api_factory/modules";
import type { ChatRoom } from "@/types/chat";

export const useGetChatRooms = () => {
  const data = ref<ChatRoom[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const execute = async (params?: {
    roomType?: string;
    isActive?: boolean;
    priority?: string;
    page?: number;
    limit?: number;
  }) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await chat_api.getRooms(params);
      console.log("API Response for getRooms:", response);
      if ([200, 201].includes(response.status)) {
        data.value = response.data?.rooms;
      }
      return data.value;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return { data, loading, error, execute };
};
