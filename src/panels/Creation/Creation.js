import React from 'react';
import { Panel, Placeholder, PanelHeader, PanelHeaderBack, Button, FormLayout, Checkbox, Cell, Group, Spinner, Separator,
         File, FormLayoutGroup, Input, Textarea, Select, Div, Card, FixedLayout, Avatar, Link } from '@vkontakte/vkui';
import Icon28TargetOutline from '@vkontakte/icons/dist/28/target_outline';
import Icon28CalendarOutline from '@vkontakte/icons/dist/28/calendar_outline';
import Icon28PictureOutline from '@vkontakte/icons/dist/28/picture_outline';
import Icon56GalleryOutline from '@vkontakte/icons/dist/56/gallery_outline';
import Icon28PodcastOutline from '@vkontakte/icons/dist/28/podcast_outline';
import './Creation.css';

class Creation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      duration: null
    }
  }

  changeImage = (image) => {
    let container = <img src={window.URL.createObjectURL(image)}/>;
		this.props.data.image = container;
    this.props.commit(this.props.data);
  }

  getAudioDuration = () => {
    let src = window.URL.createObjectURL(this.props.data.audio)
    let audio = new Audio();
    audio.addEventListener('loadedmetadata', () => {
        let seconds = Math.floor(audio.duration);
        let minutes = 0;

        while ((seconds - 60) > 1) {
            seconds -= 60;
            minutes += 1;
        }
        this.props.data.duration = `${minutes}:${seconds}`;
        this.props.commit(this.props.data);
    });
    audio.src = src;
  }

  changeAudio = (audio) => {
    this.props.data.audio = audio;
    this.props.commit(this.props.data);
    this.getAudioDuration();
  }

  delAudio = () => {
    this.props.data.audio = null;
    this.props.commit(this.props.data);
    this.setState({ duration: null })
  }

  onNameChange = (value) => {
    this.props.data.name = value;
    this.props.commit(this.props.data);
  }

  onDescriptionChange = (value) => {
    this.props.data.description = value;
    this.props.commit(this.props.data);
  }

  render() {
    let data = this.props.data;
    let canGo = data.name && data.image && data.audio && data.description;

    return (
      <Panel id={this.props.id}>
        <PanelHeader left={<PanelHeaderBack onClick={this.props.goBack}/>}>Новый подкаст</PanelHeader>
        <div className='flex ImageWrapper'>
          <Card mode='outline' className={data.image ? 'flex Image' : 'flex Image Unuploaded'}>
            { !data.image ?
                <div className='flex FileInput'>
                  <File onChange={e => {this.changeImage(e.target.files[0])}} accept='image/jpeg,image/png' mode='tertiary' className='flex'>
                    <Icon56GalleryOutline width={32} height={32}/>
                  </File>
                </div>
              :
                <File onChange={e => {this.changeImage(e.target.files[0])}} accept='image/jpeg,image/png' mode='tertiary' className='flex Uploaded'>
                  {data.image}
                </File>
            }
          </Card>
          <FormLayout>
            <FormLayoutGroup top='Название'>
              <Input placeholder='Введите название подкаста' value={data.name || ''} onChange={e => this.onNameChange(e.target.value)}/>
            </FormLayoutGroup>
          </FormLayout>
        </div>

        <FormLayout>
          <FormLayoutGroup top='Описание' className='TextareaWrapper'>
            <Textarea grow={false} placeholder='Введите описание подкаста' value={data.description || ''} onChange={e => this.onDescriptionChange(e.target.value)}/>
          </FormLayoutGroup>
        </FormLayout>

        <Group separator='hide' style={{ paddingTop: 12 }} description={data.audio && 'Вы можете добавить таймкоды и скорректировать подкаст в режиме редактирования'}>
          { !data.audio ?
              <Placeholder header='Загрузите подкаст' action={
                <File mode='outline' accept='".mp3,audio/"' controlSize='l' onChange={e => {this.changeAudio(e.target.files[0])}}>
                  Загрузить файл
                </File>
              }>
                Выберите готовый аудиофайл на вашем устройстве и добавьте его
              </Placeholder>
            :

              <Cell before={<Avatar mode='app'><Icon28PodcastOutline /></Avatar>} asideContent={!data.duration ? <Spinner size='s'/> : data.duration}
               description={<Link style={{ color: 'var(--destructive)' }} onClick={this.delAudio}>Удалить файл</Link>}>
                {data.audio.name}
              </Cell>

          }

        </Group>
        {
          data.audio && <Div><Button stretched size='xl' mode='outline' onClick={() => this.props.go('editor')}>Редактировать аудиозапись</Button></Div>
        }

        <Separator />

        <Group separator='hide'>
          <FormLayout>
            <Checkbox>Ненормативный контент</Checkbox>
            <Checkbox>Исключить эпизод из экспорта</Checkbox>
            <Checkbox>Трейлер подкаста</Checkbox>
          </FormLayout>
        </Group>

        <Group description='При публикации записи с эпизодом, он становится доступным для всех пользователей'>
          <Cell expandable description='Всем пользователям' onClick={() => {console.log('Представьте, что этот код открывает новую панель');}}>
            Кому доступен данный подкаст
          </Cell>
        </Group>

        <div style={{ height: 68 }}/>

        <FixedLayout vertical='bottom' filled>
          <Div>
            <Button onClick={() => this.props.go('posting')} disabled={!canGo} stretched size='xl'>
              Далее
            </Button>
          </Div>
        </FixedLayout>

      </Panel>
    )
  }
}

export default Creation;
