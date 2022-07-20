import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { VStack, Text, HStack, useTheme, ScrollView, Box } from 'native-base';
import { useRoute, useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';
import { dateFormat } from './../utils/firestoreDateFormat';
import { CircleWavyCheck, Hourglass, DesktopTower, ClipboardText} from 'phosphor-react-native';

import { Input } from '../components/Input';
import { Header } from '../components/Header';
import { OrderProps } from '../components/Order';
import { Loading } from './../components/Loading';
import { CardDetails } from './../components/CardDetails';
import { Button } from '../components/Button';

type RouteParams = {
  orderId: string;
}

type OrderDetails = OrderProps & {
  description: string;
  soluction: string;
  closed: string;
}

export function Details() {
  const [soluction, setSoluction] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);

  const navigation = useNavigation();
  const { colors } = useTheme();
  const route = useRoute();

  const { orderId } = route.params as RouteParams;

  function handleOrderClose(){
    if (!soluction) {
      return Alert.alert('Solicitação', 'Informar a solução	para encerrar')
    }

    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .update({
        status: 'closed',
        soluction,
        closed_at: firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        Alert.alert('Solicitação', 'Solicitação encerrada');
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('Solicitação', 'Não foi possível encerrar a solicitação');
      });
  }

  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .get()
      .then((doc) =>{
        const { patrimony, description, status, create_at, closed_at, soluction} = doc.data();

        const closed  = closed_at ? dateFormat(closed_at) : null;

        setOrder({
          id: doc.id,
          patrimony,
          description,
          status,
          soluction,
          when: dateFormat(create_at),
          closed
        })

        setIsLoading(false);
      });
  }, []);

  if(isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} bg="gray.700">
      <Box px={6} bg="gray.600">
        <Header title="Solicitação" />
      </Box>
      
      <HStack bg="gray.500" justifyContent="center" p={4}>
        {
          order.status === 'closed'
            ?<CircleWavyCheck size={22} color={colors.green[300]} />
          : <Hourglass size={22} color={colors.secondary[700]} />
        }

        <Text
          fontSize="sm"
          color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
          ml={2}
          textTransform="uppercase"
        >
          {order.status === 'closed' ?'finalizado' : 'em andamento'}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails 
          title="equipamento"
          description={`Patrimônio ${order.patrimony}`}
          icon={DesktopTower}
        />

        <CardDetails 
          title="descrição do problema"
          description={order.description}
          icon={ClipboardText}
          footer={`Registrado em ${order.when}`}
        />

        <CardDetails 
          title="solução"
          icon={CircleWavyCheck}
          description={order.soluction}
          footer={order.closed && `Encerrado em ${order.closed}`}
        >
          {
            order.status === 'open' &&
            <Input 
              placeholder="Descrição da solução"
              onChangeText={setSoluction}
              textAlignVertical="top"
              multiLine
              h={24}
            />
          }
        </CardDetails>  
      </ScrollView>

      {
        order.status === 'open' && 
        <Button 
          title='Encerrar solicitação'
          m={5}
          onPress={handleOrderClose}
        />

      }
    </VStack>
  );
}