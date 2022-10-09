//
//  ActionButton.swift
//  PocketCards
//
//  Created by macmini on 2022/10/06.
//

import SwiftUI

struct ActionButton: View {
    var text: String
    var backgroudColor: Color = .primaryColor
    var foregroundColor: Color = .black

    var body: some View {
        Button {
            self.onClick()
        } label: {
            Text(self.text)
                .padding()
                .frame(height: 48, alignment: .center)
                .background(backgroudColor)
                .foregroundColor(foregroundColor)
        }
    }

    let onClick: () -> Void
}

struct ActionButton_Previews: PreviewProvider {
    static var previews: some View {
        ActionButton(text: "test") {}
    }
}
