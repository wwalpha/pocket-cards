//
//  ChoiceButtonView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import SwiftUI

struct ChoiceButton: View {
    var text: String
    var index: String
    var isError: Bool = false

    let onDetail: () -> Void

    var body: some View {
        HStack {
            Button(action: onDetail) {
                HStack {
                    Text(self.index)
                        .frame(width: 64, height: 64, alignment: .center)
                        .font(.title)
                        .background(Color.purple)
                        .foregroundColor(Color.white)
                    Text(self.text)
                        .frame(maxWidth: .infinity, maxHeight: 32, alignment: .leading)
                        .padding(.all)
                        .padding(.leading, 16)
                        .font(.title)
                        .foregroundColor(Color.black)
//                        .foregroundColor(Color.gray.opacity(0.8))
                        .contentShape(Rectangle())
                }.border(isError ? Color.error : Color.purple, width: 2)
            }
        }
    }
}

struct ChoiceButtonView_Previews: PreviewProvider {
    static var previews: some View {
        ChoiceButton(text: "12345", index: "1", isError: true) {
            print(111)
        }
    }
}
