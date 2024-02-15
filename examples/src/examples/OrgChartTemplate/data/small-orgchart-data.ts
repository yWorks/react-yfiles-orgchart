/****************************************************************************
 ** @license
 ** This demo file is part of yFiles for HTML 2.6.
 ** Copyright (c) 2000-2023 by yWorks GmbH, Vor dem Kreuzberg 28,
 ** 72070 Tuebingen, Germany. All rights reserved.
 **
 ** yFiles demo files exhibit yFiles for HTML functionalities. Any redistribution
 ** of demo files in source code or binary form, with or without
 ** modification, is not permitted.
 **
 ** Owners of a valid software license for a yFiles for HTML version that this
 ** demo is shipped with are allowed to use the demo source code as basis
 ** for their own yFiles for HTML powered applications. Use of such programs is
 ** governed by the rights and conditions as set out in the yFiles for HTML
 ** license agreement.
 **
 ** THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESS OR IMPLIED
 ** WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 ** MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN
 ** NO EVENT SHALL yWorks BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 ** SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 ** TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 ** PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 ** LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 ** NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 ** SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 **
 ***************************************************************************/

// The JSON model data for the organization chart example.
// Class TreeBuilder automatically creates
// a yFiles graph model from the data.
export default [
  {
    id: 1,
    position: 'Chief Executive Officer',
    name: 'Eric Joplin',
    email: 'ejoplin@yoyodyne.com',
    phone: '555-0100',
    fax: '555-0101',
    businessUnit: 'Executive Unit',
    status: 'present',
    icon: 'https://live.yworks.com/demos/showcase/orgchart/resources/usericon_female1.svg',
    subordinates: [2, 3, 4]
  },
  {
    id: 2,
    name: 'Alexander Burns',
    firstName: 'Alexander',
    lastName: 'Burns',
    favouritePet: 'Cat',
    hobby: 'Acrobatics',
    emergencyContact: 'Emily Burns',
    sponsor: 'Anonymous',
    favouriteColor: 'tomato',
    icon: 'https://live.yworks.com/demos/showcase/orgchart/resources/usericon_female1.svg'
  },
  {
    id: 3,
    firstName: 'Alexander',
    lastName: 'Burns',
    favouritePet: 'Cat',
    hobby: 'Acrobatics',
    emergencyContact: 'Emily Burns',
    sponsor: 'Anonymous',
    favouriteColor: 'tomato'
  },
  {
    id: 4,
    icon: 'https://live.yworks.com/demos/showcase/orgchart/resources/usericon_female1.svg'
  }
]
