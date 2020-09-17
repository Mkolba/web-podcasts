import React from 'react';
import { Panel, Placeholder, PanelHeader, PanelHeaderBack, Button, FormLayout, Checkbox, Cell, Group, Spinner, Separator,
         File, FormLayoutGroup, Input, Textarea, Select, Div, Card, FixedLayout, Avatar, Link, Header } from '@vkontakte/vkui';
import Icon28TargetOutline from '@vkontakte/icons/dist/28/target_outline';
import Icon28CalendarOutline from '@vkontakte/icons/dist/28/calendar_outline';
import Icon28PictureOutline from '@vkontakte/icons/dist/28/picture_outline';
import Icon56GalleryOutline from '@vkontakte/icons/dist/56/gallery_outline';
import Icon28PodcastOutline from '@vkontakte/icons/dist/28/podcast_outline';
import './Posting.css';

class Posting extends React.Component {

  render() {
    let data = this.props.data;
    let canGo = data.name && data.image && data.audio && data.description;

    return (
      <Panel id={this.props.id}>
        <PanelHeader left={<PanelHeaderBack onClick={this.props.goBack}/>}>Новый подкаст</PanelHeader>
        <Group separator='hide'>
          <div className='flex ImageWrapper' style={{ paddingTop: 0 }}>
            <Card mode='outline' className='flex Image'>
              {data.image}
            </Card>

            <div className='flex' style={{ paddingLeft: 14, alignItems: 'flex-start', height: 62 }}>
              <div className='Podcast__header'>
                {data.name}
              </div>

              <div className='Podcast__author'>
                <Link>Место для вашей рекламы</Link>
              </div>

              <div className='Podcast__description'>
                Длительность: {data.duration}
              </div>
            </div>

            <div style={{ flexGrow: 1 }}/>

          </div>
        </Group>

        <Group header={<Header>Описание подкаста</Header>} separator='hide'>
          <Div>
            {data.description}
          </Div>
        </Group>

        <Group header={<Header>Содержание</Header>}>
          {data.timecodes.length > 0 ?
            data.timecodes.map((item, i) => {
              return (
                <Cell>
                  <Link>{item.time}</Link> — {item.name}
                </Cell>
              )
            })
            :
            <Placeholder>
              Автор подкаста не расставил таймкоды
            </Placeholder>
          }
        </Group>

        <div style={{ height: 68 }}/>

        <FixedLayout vertical='bottom' filled>
          <Div>
            <Button onClick={() => this.props.go('posted')} stretched size='xl'>
              Опубликовать
            </Button>
          </Div>
        </FixedLayout>

      </Panel>
    )
  }
}

export default Posting;
