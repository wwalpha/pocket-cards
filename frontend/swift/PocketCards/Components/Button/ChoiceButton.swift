//
//  ChoiceButtonView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import SwiftUI

struct ChoiceButton: View {
    var text: String
    var isError: Bool = false

    let onDetail: () -> Void

    var body: some View {
        HStack {
            Button(action: onDetail) {
                HStack {
                    Text(self.text)
                        .frame(maxWidth: .infinity, maxHeight: 32, alignment: .leading)
                        .padding(.all)
                        .padding(.leading, 16)
                        .font(.title)
                        .foregroundColor(Color.gray)
//                        .foregroundColor(Color.gray.opacity(0.8))
                        .contentShape(Rectangle())
                }.border(isError ? Color.error : Color.secondary, width: 5)
            }
        }
    }
}

struct ChoiceButtonView_Previews: PreviewProvider {
    static var previews: some View {
        ChoiceButton(text: "12345", isError: true) {
            print(111)
        }
    }
}
