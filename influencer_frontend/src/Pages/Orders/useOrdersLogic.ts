import { updateOrderStatus } from '../../services/creator.service';
import type { BookingItem, Creator, User } from '../../Types/Creator';
import type { Brand } from '../../entities/Brand';

interface UseOrdersLogicProps {
  items: BookingItem[];
  setItems: (items: BookingItem[]) => void;
  selectedCreator: Creator | null;
  setSelectedCreator: (creator: Creator | null) => void;
  selectedBrand: Brand | null;
  setSelectedBrand: (brand: Brand | null) => void;
  selectedOrders: BookingItem[];
  setSelectedOrders: (orders: BookingItem[]) => void;
  buttonStates: {
    [key: string]: 'default' | 'confirm-accept' | 'confirm-decline' | 'accepted';
  };
  setButtonStates: React.Dispatch<
    React.SetStateAction<{
      [key: string]: 'default' | 'confirm-accept' | 'confirm-decline' | 'accepted';
    }>
  >;

  tabValue: number;
  user: User;
}

export function useOrdersLogic({
  items,
  setItems,
  selectedCreator,
  setSelectedCreator,
  selectedBrand,
  setSelectedBrand,
  selectedOrders,
  setSelectedOrders,
  setButtonStates,
  tabValue,
  user,
}: UseOrdersLogicProps) {
  const handleCreatorClick = (creator: Creator, orderId: number) => {
    setSelectedCreator(creator);
    const specificOrder = items.find(
      (item: BookingItem) => item.creatorService.creatorId === creator.id && item.id === orderId,
    );
    setSelectedOrders(specificOrder ? [specificOrder] : []);
  };

  const handleBrandClick = (brand: Brand, orderId: number) => {
    setSelectedBrand(brand);
    const specificOrder = items.find(
      (item: BookingItem) => item.booking.brandId === brand.id && item.id === orderId,
    );
    setSelectedOrders(specificOrder ? [specificOrder] : []);
  };

  const handleAcceptClick = async (orderId: number) => {
    setSelectedOrders(
      selectedOrders.map((order: BookingItem) =>
        order.id === orderId ? { ...order, status: 'In Progress' as BookingItem['status'] } : order,
      ),
    );
    setItems(
      items.map((order) =>
        order.id === orderId ? { ...order, status: 'In Progress' as BookingItem['status'] } : order,
      ),
    );
    await updateOrderStatus(orderId, 'In Progress');
  };

  const handleDeclineClick = async (orderId: number) => {
    setSelectedOrders(
      selectedOrders.map((order: BookingItem) =>
        order.id === orderId ? { ...order, status: 'Declined' as BookingItem['status'] } : order,
      ),
    );
    setItems(
      items.map((order) =>
        order.id === orderId ? { ...order, status: 'Declined' as BookingItem['status'] } : order,
      ),
    );
    await updateOrderStatus(orderId, 'Declined');
  };

  const handleCompleteClick = async (orderId: number) => {
    setSelectedOrders(
      selectedOrders.map((order: BookingItem) =>
        order.id === orderId ? { ...order, status: 'Completed' as BookingItem['status'] } : order,
      ),
    );
    setItems(
      items.map((order) =>
        order.id === orderId ? { ...order, status: 'Completed' as BookingItem['status'] } : order,
      ),
    );
    await updateOrderStatus(orderId, 'Completed');
  };

  const getFilteredOrders = () => {
    return selectedOrders.filter((order) => {
      switch (tabValue) {
        case 0:
          return order.status === 'Requested';
        case 1:
          return order.status === 'In Progress';
        case 2:
          return order.status === 'Completed';
        default:
          return true;
      }
    });
  };

  const handleButtonClick = (orderId: number, action: 'accept' | 'decline') => {
    setButtonStates(
      (prev: { [key: string]: 'default' | 'confirm-accept' | 'confirm-decline' | 'accepted' }) => {
        const key = String(orderId);
        const current = prev[key] ?? 'default';

        if (current === 'default') {
          return { ...prev, [key]: action === 'accept' ? 'confirm-accept' : 'confirm-decline' };
        }

        if (current === 'confirm-accept') {
          handleAcceptClick(orderId);
          const newStates = { ...prev };
          delete newStates[key];
          return newStates;
        }

        if (current === 'confirm-decline') {
          handleDeclineClick(orderId);
          const newStates = { ...prev };
          delete newStates[key];
          return newStates;
        }

        return prev;
      },
    );
  };

  const getOtherUser = () => {
    if (user.role === 'brand' && selectedCreator) {
      return {
        id: selectedCreator.id,
        name: selectedCreator.name || selectedCreator.username,
      };
    } else if (user.role === 'creator' && selectedBrand) {
      return {
        id: selectedBrand.id,
        name: selectedBrand.name || selectedBrand.username,
      };
    }
    return null;
  };

  return {
    handleCreatorClick,
    handleBrandClick,
    handleButtonClick,
    handleCompleteClick,
    getOtherUser,
    getFilteredOrders,
  };
}
