import React from 'react'
import { COLORS } from '../styles/theme/colors'
import Box from '@mui/material/Box'
import { Story } from '@storybook/react'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

export default {
  title: 'Example/Colors',
}

const ColorContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
  gridGap: '5px',
  boxSizing: 'border-box',
  backgroundColor: '#e3e3e3',
  padding: theme.spacing(3),
}))

const Template: Story = () => {
  return (
    <ColorContainer>
      {Object.entries(COLORS).map(([colorName, colorValue]) => (
        <Box
          key={colorName}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colorValue,
            borderRadius: 1,
            width: '100px',
            height: '100px',
          }}
          title={colorName}
        >
          <Typography sx={{ fontSize: 10 }}>{colorName}</Typography>
          <br />
          <Typography sx={{ fontSize: 10 }} color={COLORS.white}>
            {colorName}
          </Typography>
        </Box>
      ))}
    </ColorContainer>
  )
}

export const Showroom = Template.bind({})
Showroom.args = {}
