import React from 'react'
import Image from 'next/image'
import CCmap from '../../styles/ccmap.gif'
import styles from '../../styles/Home.module.css'

function About() {
  return (
    <div className={styles.about}>
      <Image src={CCmap} alt="" srcset="" />
    </div>
  )
}

export default About