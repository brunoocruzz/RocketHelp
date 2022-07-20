import { useState } from 'react';
import { Alert } from 'react-native';
import { VStack } from 'native-base';
import { useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';




export function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [patrimony, setPatrimony] = useState('');
  const [description, setDescription] = useState('');

  const navigation = useNavigation();

  function handleNewOrderResgister() {
    if(!patrimony || !description){
      return Alert.alert('Registrar', 'Por favor, preencha todos os campos.')
    }

    setIsLoading(true);

    firestore()
      .collection('orders')
      .add({
        patrimony,
        description,
        status: 'open',
        create_at: firestore.FieldValue.serverTimestamp()
      })
      .then(() =>{
        Alert.alert("Solicitação", "Solitação resgistrada com sucesso.");
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        return Alert.alert('Solicitação', 'Não foi possível registrar o pedido.');
      });

  }


  return (
    <VStack flex={1} px={6} bg="gray.600">
      <Header title="Solicitação"/>
      <Input 
        placeholder="Número do Patrimônio"
        mt={4}
        onChangeText={setPatrimony}
      />

      <Input 
        placeholder="Descrição do problema"
        flex={1}
        mt={5}
        multiLine
        textAlignVertical="top"
        onChangeText={setDescription}
      />

      <Button 
        title="Cadastrar" 
        mt={5} 
        mb={5}
        isLoading={isLoading}
        onPress={handleNewOrderResgister}
      />
    </VStack>
  );
}