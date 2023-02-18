//
//  CardButton.swift
//  PocketCards
//
//  Created by macmini on 2022/03/12.
//

import SwiftUI

struct CardButton: View {
    var text: String
    var backgroudColor: Color = .primaryColor
    var foregroundColor: Color = .black

    var body: some View {
        Button {
            self.onClick()
        } label: {
            Text(self.text)
                .frame(height: 64, alignment: .center)
                .background(backgroudColor)
                .foregroundColor(foregroundColor)
        }
    }

    let onClick: () -> Void
}

struct CardButton_Previews: PreviewProvider {
    static var previews: some View {
        CardButton(text: "国語") {}
    }
}
