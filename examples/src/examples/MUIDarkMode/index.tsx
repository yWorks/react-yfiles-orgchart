import { ReactNode, useMemo, useState } from 'react'
import {
  ContextMenuItem,
  CustomOrgChartItem,
  OrgChart,
  OrgChartContextMenuItems,
  RenderItemProps,
  RenderTooltipProps
} from '@yworks/react-yfiles-orgchart'
import largeOrgchartData from '../../data/large-orgchart-data.ts'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import {
  Box,
  CardMedia,
  createTheme,
  CssBaseline,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  ThemeProvider,
  Tooltip
} from '@mui/material'

function TooltipTemplate({ data }: RenderTooltipProps<CustomOrgChartItem>) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {data.position}
        </Typography>
        <Typography variant="h5" component="div">
          {data.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {data.status}
        </Typography>
        <Typography variant="body2">{data.email}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  )
}

function RenderItem(props: RenderItemProps<CustomOrgChartItem>) {
  const { icon, name, position } = props.dataItem
  return (
    <Card sx={{ maxWidth: 345 }}>
      <Tooltip title={name}>
        <CardMedia component="img" alt="profile image" height="100" image={icon} />
      </Tooltip>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {position}
        </Typography>
      </CardContent>
    </Card>
  )
}

function RenderMenu({
  item,
  menuItems,
  onClose
}: {
  item: CustomOrgChartItem | null
  menuItems: ContextMenuItem<CustomOrgChartItem>[]
  onClose: Function
}): ReactNode {
  return (
    <Paper sx={{ width: 320, maxWidth: '100%' }}>
      <MenuList>
        {menuItems.map(menuItem => {
          return (
            <MenuItem
              onClick={() => {
                onClose()
                menuItem.action(item)
              }}
              key={menuItem.title}
            >
              <ListItemText>{menuItem.title}</ListItemText>
            </MenuItem>
          )
        })}
      </MenuList>
    </Paper>
  )
}

/**
 * Organization chart with dark/light mode that uses MUI components in the item visualization, context menu and tooltips.
 * This is a test for a global mode and the compatibility with other UI frameworks.
 */
export default function MUIDarkMode() {
  const [mode, setMode] = useState<'light' | 'dark'>('light')

  const currentTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode
        }
      }),
    [mode]
  )

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Box style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Button
          variant="contained"
          onClick={() => {
            setMode(mode === 'light' ? 'dark' : 'light')
          }}
        >
          Toggle Theme
        </Button>
        <OrgChart
          data={largeOrgchartData}
          renderItem={RenderItem}
          renderTooltip={TooltipTemplate}
          renderContextMenu={RenderMenu}
          contextMenuItems={OrgChartContextMenuItems}
        ></OrgChart>
      </Box>
    </ThemeProvider>
  )
}
